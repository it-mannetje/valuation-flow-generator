import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Eye, 
  EyeOff,
  FileText,
  Image as ImageIcon,
  Table,
  Type,
  Crown,
  BarChart3,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'table' | 'header' | 'logo' | 'chart';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  styling: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
  };
  layer: number;
}

interface PageData {
  pageNumber: number;
  elements: PDFElement[];
  width: number;
  height: number;
}

// Element type configurations
const ELEMENT_TYPES = {
  text: { color: '#3B82F6', icon: Type, label: 'Tekst' },
  image: { color: '#10B981', icon: ImageIcon, label: 'Afbeeldingen' },
  table: { color: '#F59E0B', icon: Table, label: 'Tabellen' },
  header: { color: '#8B5CF6', icon: Crown, label: 'Headers' },
  logo: { color: '#EF4444', icon: Crown, label: "Logo's" },
  chart: { color: '#14B8A6', icon: BarChart3, label: 'Grafieken' }
};

// Mock data generator for demonstration
const generateMockPageData = (pageNumber: number): PageData => {
  const elements: PDFElement[] = [
    {
      id: `p${pageNumber}-header-1`,
      type: 'header',
      x: 50,
      y: 20,
      width: 500,
      height: 40,
      content: `Pagina ${pageNumber} Hoofdtitel`,
      styling: { fontSize: 24, fontFamily: 'Arial', color: '#1F2937' },
      layer: 1
    },
    {
      id: `p${pageNumber}-logo-1`,
      type: 'logo',
      x: 500,
      y: 15,
      width: 80,
      height: 50,
      content: 'Company Logo',
      styling: {},
      layer: 2
    },
    {
      id: `p${pageNumber}-text-1`,
      type: 'text',
      x: 50,
      y: 100,
      width: 400,
      height: 120,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      styling: { fontSize: 12, fontFamily: 'Arial', color: '#374151' },
      layer: 1
    },
    {
      id: `p${pageNumber}-image-1`,
      type: 'image',
      x: 460,
      y: 100,
      width: 120,
      height: 80,
      content: 'Chart Image',
      styling: {},
      layer: 1
    },
    {
      id: `p${pageNumber}-table-1`,
      type: 'table',
      x: 50,
      y: 250,
      width: 300,
      height: 150,
      content: 'Data Tabel',
      styling: {},
      layer: 1
    },
    {
      id: `p${pageNumber}-chart-1`,
      type: 'chart',
      x: 370,
      y: 250,
      width: 210,
      height: 150,
      content: 'Bar Chart',
      styling: {},
      layer: 1
    }
  ];

  return {
    pageNumber,
    elements,
    width: 595, // A4 width in points
    height: 842  // A4 height in points
  };
};

export default function PageAnalyzer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  const [pageData, setPageData] = useState<PageData[]>([]);
  const [selectedElement, setSelectedElement] = useState<PDFElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<PDFElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize mock data
  useEffect(() => {
    const mockData = Array.from({ length: totalPages }, (_, i) => 
      generateMockPageData(i + 1)
    );
    setPageData(mockData);
  }, [totalPages]);

  // Canvas dimensions
  const CANVAS_WIDTH = 200;
  const CANVAS_HEIGHT = 280;

  // Get current page data
  const getCurrentPageData = useCallback(() => {
    return pageData.find(p => p.pageNumber === currentPage);
  }, [pageData, currentPage]);

  // Filter elements based on search and filter
  const getFilteredElements = useCallback(() => {
    const currentPageData = getCurrentPageData();
    if (!currentPageData) return [];

    return currentPageData.elements.filter(element => {
      const matchesSearch = searchTerm === '' || 
        element.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || element.type === filterType;
      const isVisible = !hiddenTypes.has(element.type);
      
      return matchesSearch && matchesFilter && isVisible;
    });
  }, [getCurrentPageData, searchTerm, filterType, hiddenTypes]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPageData = getCurrentPageData();
    if (!currentPageData) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Set canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Scale factors
    const scaleX = CANVAS_WIDTH / currentPageData.width;
    const scaleY = CANVAS_HEIGHT / currentPageData.height;

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      
      for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      
      for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    }

    // Draw elements
    const filteredElements = getFilteredElements();
    
    filteredElements.forEach(element => {
      const x = element.x * scaleX * zoom;
      const y = element.y * scaleY * zoom;
      const width = element.width * scaleX * zoom;
      const height = element.height * scaleY * zoom;

      // Element rectangle
      const elementColor = ELEMENT_TYPES[element.type].color;
      
      // Fill with transparency
      ctx.fillStyle = elementColor + '40'; // 25% opacity
      ctx.fillRect(x, y, width, height);

      // Border
      ctx.strokeStyle = elementColor;
      ctx.lineWidth = selectedElement?.id === element.id ? 3 : 
                     hoveredElement?.id === element.id ? 2 : 1;
      ctx.strokeRect(x, y, width, height);

      // Label for larger elements
      if (width > 30 && height > 15) {
        ctx.fillStyle = elementColor;
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          ELEMENT_TYPES[element.type].label,
          x + width / 2,
          y + height / 2 + 3
        );
      }
    });

  }, [getCurrentPageData, getFilteredElements, selectedElement, hoveredElement, showGrid, zoom]);

  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const currentPageData = getCurrentPageData();
    if (!currentPageData) return;

    const scaleX = CANVAS_WIDTH / currentPageData.width;
    const scaleY = CANVAS_HEIGHT / currentPageData.height;

    // Find clicked element
    const filteredElements = getFilteredElements();
    const clickedElement = filteredElements.find(element => {
      const elementX = element.x * scaleX * zoom;
      const elementY = element.y * scaleY * zoom;
      const elementWidth = element.width * scaleX * zoom;
      const elementHeight = element.height * scaleY * zoom;

      return x >= elementX && x <= elementX + elementWidth &&
             y >= elementY && y <= elementY + elementHeight;
    });

    setSelectedElement(clickedElement || null);
  }, [getCurrentPageData, getFilteredElements, zoom]);

  // Canvas mouse move handler
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const currentPageData = getCurrentPageData();
    if (!currentPageData) return;

    const scaleX = CANVAS_WIDTH / currentPageData.width;
    const scaleY = CANVAS_HEIGHT / currentPageData.height;

    // Find hovered element
    const filteredElements = getFilteredElements();
    const hoveredEl = filteredElements.find(element => {
      const elementX = element.x * scaleX * zoom;
      const elementY = element.y * scaleY * zoom;
      const elementWidth = element.width * scaleX * zoom;
      const elementHeight = element.height * scaleY * zoom;

      return x >= elementX && x <= elementX + elementWidth &&
             y >= elementY && y <= elementY + elementHeight;
    });

    setHoveredElement(hoveredEl || null);
    canvas.style.cursor = hoveredEl ? 'pointer' : 'default';
  }, [getCurrentPageData, getFilteredElements, zoom]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Toggle element type visibility
  const toggleElementType = (type: string) => {
    const newHiddenTypes = new Set(hiddenTypes);
    if (newHiddenTypes.has(type)) {
      newHiddenTypes.delete(type);
    } else {
      newHiddenTypes.add(type);
    }
    setHiddenTypes(newHiddenTypes);
  };

  // Export functions
  const exportToExcel = () => {
    const currentPageData = getCurrentPageData();
    if (!currentPageData) return;

    const csvContent = [
      ['Pagina', 'Element Type', 'X', 'Y', 'Breedte', 'Hoogte', 'Content'].join(','),
      ...currentPageData.elements.map(element => [
        currentPage,
        ELEMENT_TYPES[element.type].label,
        element.x,
        element.y,
        element.width,
        element.height,
        `"${element.content.substring(0, 50)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${currentPage}-elements.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Succesvol",
      description: `Pagina ${currentPage} elementen geëxporteerd naar CSV`,
    });
  };

  const exportCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `page-${currentPage}-visual-map.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Visual Map Geëxporteerd",
      description: `Pagina ${currentPage} visual map opgeslagen als PNG`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              PDF Pagina Analyzer
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={exportCanvasImage}>
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Page Selector */}
            <div className="flex items-center gap-2">
              <Label>Pagina:</Label>
              <Select 
                value={currentPage.toString()} 
                onValueChange={(value) => setCurrentPage(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Pagina {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Zoek elementen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Types</SelectItem>
                  {Object.entries(ELEMENT_TYPES).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-mono w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Grid Toggle */}
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pagina {currentPage} Visualisatie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoveredElement(null)}
                className="border border-border rounded-lg shadow-sm bg-white"
              />
              
              {/* Element Type Legend */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(ELEMENT_TYPES).map(([type, config]) => {
                  const Icon = config.icon;
                  const isHidden = hiddenTypes.has(type);
                  return (
                    <Button
                      key={type}
                      variant={isHidden ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleElementType(type)}
                      className="flex items-center gap-1"
                      style={{
                        backgroundColor: !isHidden ? config.color : undefined,
                        borderColor: config.color
                      }}
                    >
                      {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Element Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Element Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedElement ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    style={{ backgroundColor: ELEMENT_TYPES[selectedElement.type].color }}
                    className="text-white"
                  >
                    {ELEMENT_TYPES[selectedElement.type].label}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">X:</span>
                    <span>{selectedElement.x}px</span>
                    <span className="font-medium">Y:</span>
                    <span>{selectedElement.y}px</span>
                    <span className="font-medium">Breedte:</span>
                    <span>{selectedElement.width}px</span>
                    <span className="font-medium">Hoogte:</span>
                    <span>{selectedElement.height}px</span>
                    <span className="font-medium">Layer:</span>
                    <span>{selectedElement.layer}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Content:</Label>
                  <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded">
                    {selectedElement.content}
                  </p>
                </div>

                {Object.keys(selectedElement.styling).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium">Styling:</Label>
                      <div className="text-xs space-y-1 mt-1">
                        {Object.entries(selectedElement.styling).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : hoveredElement ? (
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Hover over: {hoveredElement.content.substring(0, 30)}...</p>
                <p className="text-xs">Klik om details te bekijken</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Klik op een element om details te bekijken</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Element List */}
      <Card>
        <CardHeader>
          <CardTitle>Element Lijst - Pagina {currentPage}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {getFilteredElements().map((element) => {
                const Icon = ELEMENT_TYPES[element.type].icon;
                const isSelected = selectedElement?.id === element.id;
                
                return (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon 
                          className="w-4 h-4" 
                          style={{ color: ELEMENT_TYPES[element.type].color }} 
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {ELEMENT_TYPES[element.type].label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {element.content.substring(0, 40)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>x:{element.x}, y:{element.y}</p>
                        <p>{element.width}×{element.height}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}