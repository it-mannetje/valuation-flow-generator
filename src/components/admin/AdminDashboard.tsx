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
import { SECTORS, SectorConfig } from '@/types/calculator';
import { Settings, Edit, Save, RotateCcw, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import PDFContentManager from './PDFContentManager';

export default function AdminDashboard() {
  const [sectors, setSectors] = useState<SectorConfig[]>(SECTORS);
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SectorConfig>>({});
  const { toast } = useToast();

  const handleEdit = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      setEditingSector(sectorId);
      setEditData(sector);
    }
  };

  const handleSave = () => {
    if (editingSector && editData) {
      setSectors(prev => prev.map(sector => 
        sector.id === editingSector 
          ? { ...sector, ...editData } as SectorConfig
          : sector
      ));
      setEditingSector(null);
      setEditData({});
      toast({
        title: "Sector Bijgewerkt",
        description: "De sector instellingen zijn succesvol opgeslagen.",
      });
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
      title: "Instellingen Geëxporteerd",
      description: "Sector instellingen zijn gedownload als JSON bestand.",
    });
  };

  const handleBulkUpdate = () => {
    toast({
      title: "Bulk Update",
      description: "Bulk update functionaliteit wordt ontwikkeld.",
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
              <p className="text-muted-foreground">Beheer sector instellingen en waardering parameters</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="sectors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sectors">Sector Management</TabsTrigger>
            <TabsTrigger value="pdf">PDF Beheer</TabsTrigger>
            <TabsTrigger value="settings">Algemene Instellingen</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="sectors">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Sector Configuratie</CardTitle>
                    <p className="text-muted-foreground">Beheer EBITDA multiples en sectorspecifieke teksten</p>
                  </div>
                  <div className="flex gap-2">
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sector</TableHead>
                        <TableHead>Beschrijving</TableHead>
                        <TableHead>Multiple</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acties</TableHead>
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
                            <Badge variant="secondary">Actief</Badge>
                          </TableCell>
                          <TableCell>
                            {editingSector === sector.id ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSave}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEdit(sector.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Sector Text Editor */}
                {editingSector && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Sector Tekst Bewerken</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="sector-name">Sector Naam</Label>
                        <Input
                          id="sector-name"
                          value={editData.name || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sector-description">Beschrijving</Label>
                        <Input
                          id="sector-description"
                          value={editData.description || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sector-text">Sectorspecifieke Tekst</Label>
                        <Textarea
                          id="sector-text"
                          rows={4}
                          value={editData.text || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Voer de sectorspecifieke tekst in voor het PDF rapport..."
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
                <CardTitle className="text-xl">PDF Inhoud Beheer</CardTitle>
                <p className="text-muted-foreground">Beheer teksten en afbeeldingen per PDF pagina</p>
              </CardHeader>
              <CardContent className="p-6">
                <PDFContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <CardTitle>Algemene Instellingen</CardTitle>
                <p className="text-muted-foreground">Configureer algemene parameters voor de calculator</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="default-multiple">Standaard Multiple Range</Label>
                    <Input id="default-multiple" placeholder="±0.3" disabled />
                    <p className="text-sm text-muted-foreground mt-1">
                      Standaard range voor min/max waardering berekening
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="currency">Valuta</Label>
                    <Select defaultValue="EUR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar ($)</SelectItem>
                        <SelectItem value="GBP">Pond (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="disclaimer-text">Disclaimer Tekst</Label>
                  <Textarea
                    id="disclaimer-text"
                    rows={4}
                    defaultValue="Deze waardering is een indicatie gebaseerd op EBITDA-multiples en sectorgemiddelden. De werkelijke waarde van uw bedrijf kan afwijken door factoren zoals marktpositie, groeiperspectieven, activa, schulden en marktontwikkelingen."
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-primary">
                    Instellingen Opslaan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-card border-b">
                <CardTitle>Audit Log</CardTitle>
                <p className="text-muted-foreground">Overzicht van alle wijzigingen en activiteiten</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-8">
                  <p>Audit log functionaliteit wordt ontwikkeld...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}