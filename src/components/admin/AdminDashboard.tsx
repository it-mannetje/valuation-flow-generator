import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectorConfig } from '@/types/calculator';
import { Settings, Edit, Save, RotateCcw, Upload, Download, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import PDFContentManager from './PDFContentManager';
import { useSectorConfig } from '@/hooks/useSectorConfig';
import GeneralSettingsManager from './GeneralSettingsManager';
import AuditLogViewer from './AuditLogViewer';

export default function AdminDashboard() {
  const { sectors, isLoading, updateSector, createSector, deleteSector } = useSectorConfig();
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SectorConfig>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSectorData, setNewSectorData] = useState({
    name: '',
    multiple: 0,
    description: '',
    text: '',
    headerText: ''
  });
  const { toast } = useToast();

  const handleEdit = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      setEditingSector(sectorId);
      setEditData(sector);
    }
  };

  const handleSave = async () => {
    if (editingSector && editData) {
      const updatedSector = { ...sectors.find(s => s.id === editingSector), ...editData } as SectorConfig;
      const success = await updateSector(updatedSector);
      
      if (success) {
        setEditingSector(null);
        setEditData({});
      }
    }
  };

  const handleCancel = () => {
    setEditingSector(null);
    setEditData({});
  };

  const handleExportSettings = () => {
    const data = JSON.stringify(sectors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sector-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Settings Exported",
      description: "Sector settings have been downloaded as a JSON file.",
    });
  };

  const handleCreateSector = async () => {
    if (!newSectorData.name || !newSectorData.description || newSectorData.multiple <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const success = await createSector(newSectorData);
    if (success) {
      setShowCreateForm(false);
      setNewSectorData({ name: '', multiple: 0, description: '', text: '', headerText: '' });
    }
  };

  const handleDeleteSector = async (sectorId: string) => {
    if (confirm('Are you sure you want to delete this sector?')) {
      await deleteSector(sectorId);
    }
  };

  const handleBulkUpdate = () => {
    toast({
      title: "Bulk Update",
      description: "Bulk update functionality is under development.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage sector settings and valuation parameters</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="sectors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sectors">Sector Management</TabsTrigger>
            <TabsTrigger value="pdf">PDF Management</TabsTrigger>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="sectors">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Sector Configuration</CardTitle>
                    <p className="text-muted-foreground">Manage EBITDA multiples and sector-specific texts</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Sector
                    </Button>
                    <Button variant="outline" onClick={handleExportSettings}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" onClick={handleBulkUpdate}>
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Update
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading sector configurations...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sector</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Multiple</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {sectors.map((sector) => (
                        <TableRow key={sector.id}>
                          <TableCell className="font-medium">{sector.name}</TableCell>
                          <TableCell>{sector.description}</TableCell>
                          <TableCell>
                            {editingSector === sector.id ? (
                              <Input
                                type="number"
                                step="0.1"
                                value={editData.multiple || 0}
                                onChange={(e) => setEditData(prev => ({ 
                                  ...prev, 
                                  multiple: parseFloat(e.target.value) || 0 
                                }))}
                                className="w-20"
                              />
                            ) : (
                              <span className="font-medium">{sector.multiple.toFixed(1)}x</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Active</Badge>
                          </TableCell>
                          <TableCell>
                            {editingSector === sector.id ? (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSave}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEdit(sector.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDeleteSector(sector.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Create Sector Form */}
                {showCreateForm && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Sector</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-sector-name">Sector Name</Label>
                          <Input
                            id="new-sector-name"
                            value={newSectorData.name}
                            onChange={(e) => setNewSectorData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Media, advertising & communication"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-sector-multiple">Multiple</Label>
                          <Input
                            id="new-sector-multiple"
                            type="number"
                            step="0.1"
                            value={newSectorData.multiple || ''}
                            onChange={(e) => setNewSectorData(prev => ({ ...prev, multiple: parseFloat(e.target.value) || 0 }))}
                            placeholder="3.9"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-sector-description">Description</Label>
                        <Input
                          id="new-sector-description"
                          value={newSectorData.description}
                          onChange={(e) => setNewSectorData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g. Media agencies, advertising, PR, communication"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-sector-header">Header Text</Label>
                        <Input
                          id="new-sector-header"
                          value={newSectorData.headerText}
                          onChange={(e) => setNewSectorData(prev => ({ ...prev, headerText: e.target.value }))}
                          placeholder="Header text for this sector"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-sector-text">Sector-Specific Text</Label>
                        <Textarea
                          id="new-sector-text"
                          rows={3}
                          value={newSectorData.text}
                          onChange={(e) => setNewSectorData(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Text to be used in the PDF report for this sector..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateSector}>
                          Add Sector
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sector Text Editor */}
                {editingSector && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Edit Sector Text</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="sector-name">Sector Name</Label>
                        <Input
                          id="sector-name"
                          value={editData.name || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sector-description">Description</Label>
                        <Input
                          id="sector-description"
                          value={editData.description || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sector-header">Header Text</Label>
                        <Input
                          id="sector-header"
                          value={editData.headerText || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, headerText: e.target.value }))}
                          placeholder="Header text for this sector"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sector-text">Sector-Specific Text</Label>
                        <Textarea
                          id="sector-text"
                          rows={4}
                          value={editData.text || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter sector-specific text for the PDF report..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <CardTitle className="text-xl">PDF Content Management</CardTitle>
                <p className="text-muted-foreground">Manage texts and images per PDF page</p>
              </CardHeader>
              <CardContent className="p-6">
                <PDFContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <CardTitle>General Settings</CardTitle>
                <p className="text-muted-foreground">Configure general parameters for the calculator</p>
              </CardHeader>
              <CardContent className="p-6">
                <GeneralSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <CardTitle>Audit Log</CardTitle>
                <p className="text-muted-foreground">View all changes to the database configuration</p>
              </CardHeader>
              <CardContent className="p-6">
                <AuditLogViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}