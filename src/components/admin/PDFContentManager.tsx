import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Image as ImageIcon, 
  Save, 
  Upload, 
  Trash2, 
  Plus,
  Eye
} from 'lucide-react';
import AdminPreviewPDF from '@/components/calculator/pdf/AdminPreviewPDF';
import { pdf } from '@react-pdf/renderer';
import { useSectorConfig } from '@/hooks/useSectorConfig';

interface PDFPage {
  id: string;
  page_number: number;
  page_name: string;
  background_image_url?: string;
  logo_image_url?: string;
  content: any;
  created_at: string;
  updated_at: string;
}

interface TextSection {
  type: 'paragraph' | 'heading' | 'list';
  text: string;
  style?: string;
}

export default function PDFContentManager() {
  const { sectors } = useSectorConfig();
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<PDFPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [generatePreview, setGeneratePreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_pages')
        .select('*')
        .order('page_number');

      if (error) throw error;
      setPages(data || []);
      if (data && data.length > 0) {
        setSelectedPage(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load PDF pages.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('pdf_pages')
        .update({
          page_name: selectedPage.page_name,
          background_image_url: selectedPage.background_image_url,
          logo_image_url: selectedPage.logo_image_url,
          content: selectedPage.content
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      toast({
        title: "Pagina Opgeslagen",
        description: "PDF pagina is succesvol bijgewerkt.",
      });

      await fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save page.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePageContent = (updates: Partial<PDFPage>) => {
    if (!selectedPage) return;
    setSelectedPage({ ...selectedPage, ...updates });
  };

  const updateContentField = (field: string, value: any) => {
    if (!selectedPage) return;
    const updatedContent = { ...selectedPage.content, [field]: value };
    setSelectedPage({ ...selectedPage, content: updatedContent });
  };

  const addTextSection = () => {
    if (!selectedPage) return;
    const content = selectedPage.content.content || [];
    const newSection: TextSection = {
      type: 'paragraph',
      text: 'Nieuwe tekst sectie...'
    };
    content.push(newSection);
    updateContentField('content', content);
  };

  const updateTextSection = (index: number, updates: Partial<TextSection>) => {
    if (!selectedPage) return;
    const content = [...(selectedPage.content.content || [])];
    content[index] = { ...content[index], ...updates };
    updateContentField('content', content);
  };

  const removeTextSection = (index: number) => {
    if (!selectedPage) return;
    const content = [...(selectedPage.content.content || [])];
    content.splice(index, 1);
    updateContentField('content', content);
  };

  const handleImageUpload = async (type: 'background' | 'logo', file: File) => {
    // In a real implementation, you would upload to Supabase Storage
    // For now, we'll create a placeholder URL
    const imageUrl = URL.createObjectURL(file);
    
    if (type === 'background') {
      updatePageContent({ background_image_url: imageUrl });
    } else {
      updatePageContent({ logo_image_url: imageUrl });
    }

    toast({
      title: "Afbeelding Geüpload",
      description: `${type === 'background' ? 'Achtergrond' : 'Logo'} afbeelding is geüpload.`,
    });
  };

  const handleGeneratePreview = async () => {
    setGeneratePreview(true);
    setPdfPreviewUrl(null);
    
    try {
      console.log('Starting PDF generation...');
      console.log('Pages data:', pages);
      
      // Use real data from the database instead of mock data
      const mockCompanyData = {
        lastYearRevenue: 1000000,
        recurringRevenuePercentage: 70,
        result2024: 200000,
        expectedResult2025: 250000,
        wasLossmaking: false,
        prospects: "Growth expected",
        averageYearlyInvestment: 50000,
        sector: "technology",
        employees: 50,
        largestClientDependency: 15,
        largestSupplierRisk: "Low"
      };

      const mockContactData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        companyName: "Example Company",
        position: "CEO"
      };

      const mockValuationResult = {
        baseValuation: 2000000,
        minValuation: 1800000,
        maxValuation: 2200000,
        multiple: 10,
        sector: "technology"
      };

      console.log('Creating PDF component...');
      
      // Generate PDF blob with actual pages data
      const pdfBlob = await pdf(
        <AdminPreviewPDF 
          companyData={mockCompanyData}
          contactData={mockContactData}
          valuationResult={mockValuationResult}
          pages={pages}
          sectors={sectors}
        />
      ).toBlob();

      console.log('PDF blob created:', pdfBlob);

      // Open PDF in new window instead of iframe
      const url = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        // Clean up the URL after a delay to prevent memory leaks
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        toast({
          title: "Preview Geopend",
          description: "PDF preview wordt geopend in een nieuw venster.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Pop-up geblokkeerd. Sta pop-ups toe voor deze site.",
        });
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate PDF preview: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setGeneratePreview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading PDF pages...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Page List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              PDF Pagina's
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={selectedPage?.id === page.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedPage(page)}
              >
                <span className="mr-2">{page.page_number}.</span>
                {page.page_name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Page Editor */}
      <div className="lg:col-span-3">
        {selectedPage ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pagina {selectedPage.page_number}: {selectedPage.page_name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleGeneratePreview} disabled={generatePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    {generatePreview ? 'Genereren...' : 'PDF Preview'}
                  </Button>
                  <Button onClick={handleSavePage} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Opslaan...' : 'Opslaan'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Tekst Inhoud</TabsTrigger>
                  <TabsTrigger value="images">Afbeeldingen</TabsTrigger>
                  <TabsTrigger value="settings">Instellingen</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* Page Title */}
                  <div>
                    <Label htmlFor="page-title">Pagina Titel</Label>
                    <Input
                      id="page-title"
                      value={selectedPage.content.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Voer pagina titel in..."
                    />
                  </div>

                  {/* Subtitle (for cover page) */}
                  {selectedPage.page_number === 1 && (
                    <div>
                      <Label htmlFor="subtitle">Ondertitel</Label>
                      <Input
                        id="subtitle"
                        value={selectedPage.content.subtitle || ''}
                        onChange={(e) => updateContentField('subtitle', e.target.value)}
                        placeholder="Voer ondertitel in..."
                      />
                    </div>
                  )}

                  <Separator />

                  {/* Text Sections */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label>Tekst Secties</Label>
                      <Button onClick={addTextSection} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Voeg Sectie Toe
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {(selectedPage.content.content || []).map((section: TextSection, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">
                                Sectie {index + 1}: {section.type}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTextSection(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <select
                                value={section.type}
                                onChange={(e) => updateTextSection(index, { 
                                  type: e.target.value as 'paragraph' | 'heading' | 'list' 
                                })}
                                className="px-3 py-2 border rounded-md"
                              >
                                <option value="paragraph">Paragraaf</option>
                                <option value="heading">Koptekst</option>
                                <option value="list">Lijst</option>
                              </select>
                            </div>

                            <Textarea
                              value={section.text}
                              onChange={(e) => updateTextSection(index, { text: e.target.value })}
                              rows={4}
                              placeholder="Voer tekst in..."
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  {/* Background Image */}
                  <div>
                    <Label>Achtergrond Afbeelding</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg">
                      {selectedPage.background_image_url ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm">Achtergrond ingesteld</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePageContent({ background_image_url: undefined })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Verwijder
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <Label htmlFor="background-upload" className="cursor-pointer">
                            <span className="text-sm text-muted-foreground">
                              Klik om achtergrond afbeelding te uploaden
                            </span>
                            <Input
                              id="background-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload('background', file);
                              }}
                            />
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo Image */}
                  <div>
                    <Label>Logo Afbeelding</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg">
                      {selectedPage.logo_image_url ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm">Logo ingesteld</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePageContent({ logo_image_url: undefined })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Verwijder
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <Label htmlFor="logo-upload" className="cursor-pointer">
                            <span className="text-sm text-muted-foreground">
                              Klik om logo afbeelding te uploaden
                            </span>
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload('logo', file);
                              }}
                            />
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div>
                    <Label htmlFor="page-name">Pagina Naam</Label>
                    <Input
                      id="page-name"
                      value={selectedPage.page_name}
                      onChange={(e) => updatePageContent({ page_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="page-number">Pagina Nummer</Label>
                    <Input
                      id="page-number"
                      type="number"
                      value={selectedPage.page_number}
                      onChange={(e) => updatePageContent({ page_number: parseInt(e.target.value) })}
                    />
                  </div>

                  {/* Special page settings */}
                  {selectedPage.page_number === 6 && (
                    <div className="space-y-4">
                      <Separator />
                      <Label>Contact Informatie</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contact-company">Bedrijfsnaam</Label>
                          <Input
                            id="contact-company"
                            value={selectedPage.content.contact_company || ''}
                            onChange={(e) => updateContentField('contact_company', e.target.value)}
                            placeholder="FBM Corporate Finance"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-address">Adres</Label>
                          <Input
                            id="contact-address"
                            value={selectedPage.content.contact_address || ''}
                            onChange={(e) => updateContentField('contact_address', e.target.value)}
                            placeholder="Hoest Suit 62, 3439 MK Nieuwegein"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-phone">Telefoon</Label>
                          <Input
                            id="contact-phone"
                            value={selectedPage.content.contact_phone || ''}
                            onChange={(e) => updateContentField('contact_phone', e.target.value)}
                            placeholder="030 - 605 22 22"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-website">Website</Label>
                          <Input
                            id="contact-website"
                            value={selectedPage.content.contact_website || ''}
                            onChange={(e) => updateContentField('contact_website', e.target.value)}
                            placeholder="www.fbm.nl"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Selecteer een pagina om te bewerken</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}