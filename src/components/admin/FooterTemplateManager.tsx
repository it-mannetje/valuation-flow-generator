import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FooterTemplate, PageFooter } from '@/types/footer';
import { Upload, Plus, Edit, Trash2, Save, RotateCcw, Image as ImageIcon } from 'lucide-react';


export default function FooterTemplateManager() {
  const [templates, setTemplates] = useState<FooterTemplate[]>([]);
  const [pageFooters, setPageFooters] = useState<PageFooter[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editData, setEditData] = useState<Partial<FooterTemplate>>({});
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template_type: 'components' as 'components' | 'full_image',
    layout_config: {
      height: '56.69',
      backgroundColor: '#FFFFFF',
      logoPosition: 'left' as const,
      logoMaxWidth: 80,
      logoMaxHeight: 30,
      pageNumberPosition: 'right' as const,
      pageNumberStyle: {
        backgroundColor: '#F3F4F6',
        borderRadius: 15,
        width: '85.04',
        height: '28.35',
        color: '#374151',
        fontSize: 12,
        fontWeight: 'bold'
      },
      dottedLineStyle: {
        color: '#2563EB',
        width: 2,
        height: 20,
        marginRight: 10
      }
    }
  });

  useEffect(() => {
    fetchTemplates();
    fetchPageFooters();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as unknown as FooterTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Fout",
        description: "Kon footer templates niet laden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPageFooters = async () => {
    try {
      const { data, error } = await supabase
        .from('page_footers')
        .select('*')
        .order('page_number');

      if (error) throw error;
      setPageFooters(data || []);
    } catch (error) {
      console.error('Error fetching page footers:', error);
    }
  };

  const handleLogoUpload = async (file: File, templateId?: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${templateId || 'new'}-${Date.now()}.${fileExt}`;
      
      // Convert file to base64 for PDF compatibility
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      return base64;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Fout",
        description: "Logo upload mislukt",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCreateTemplate = async () => {
    try {
      let logoUrl = null;
      let fullImageUrl = null;
      
      if (selectedLogo) {
        const uploadedUrl = await handleLogoUpload(selectedLogo);
        if (!uploadedUrl) return;
        
        if (newTemplate.template_type === 'full_image') {
          fullImageUrl = uploadedUrl;
        } else {
          logoUrl = uploadedUrl;
        }
      }

      const { data, error } = await supabase
        .from('footer_templates')
        .insert({
          name: newTemplate.name,
          description: newTemplate.description,
          template_type: newTemplate.template_type,
          logo_url: logoUrl,
          full_image_url: fullImageUrl,
          layout_config: newTemplate.layout_config as any
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data as unknown as FooterTemplate, ...prev]);
      setShowCreateForm(false);
      setNewTemplate({
        name: '',
        description: '',
        template_type: 'components',
        layout_config: newTemplate.layout_config
      });
      setSelectedLogo(null);

      toast({
        title: "Succes",
        description: "Footer template succesvol aangemaakt",
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Fout",
        description: "Kon footer template niet aanmaken",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate || !editData) return;

    try {
      let logoUrl = editData.logo_url;
      
      if (selectedLogo) {
        logoUrl = await handleLogoUpload(selectedLogo, editingTemplate);
        if (!logoUrl) return;
      }

      const { error } = await supabase
        .from('footer_templates')
        .update({
          name: editData.name,
          description: editData.description,
          logo_url: logoUrl,
          layout_config: editData.layout_config as any
        })
        .eq('id', editingTemplate);

      if (error) throw error;

      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate 
          ? { ...t, ...editData, logo_url: logoUrl } as unknown as FooterTemplate
          : t
      ));
      
      setEditingTemplate(null);
      setEditData({});
      setSelectedLogo(null);

      toast({
        title: "Succes",
        description: "Footer template succesvol bijgewerkt",
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Fout",
        description: "Kon footer template niet bijwerken",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Weet u zeker dat u deze footer template wilt verwijderen?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('footer_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      
      toast({
        title: "Succes",
        description: "Footer template succesvol verwijderd",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Fout",
        description: "Kon footer template niet verwijderen",
        variant: "destructive",
      });
    }
  };

  const togglePageFooter = async (pageNumber: number, templateId: string, isEnabled: boolean) => {
    try {
      const existingFooter = pageFooters.find(pf => pf.page_number === pageNumber);
      
      if (existingFooter) {
        const { error } = await supabase
          .from('page_footers')
          .update({ 
            is_enabled: isEnabled,
            footer_template_id: templateId
          })
          .eq('id', existingFooter.id);
        
        if (error) throw error;
        
        setPageFooters(prev => prev.map(pf => 
          pf.id === existingFooter.id 
            ? { ...pf, is_enabled: isEnabled, footer_template_id: templateId }
            : pf
        ));
      } else {
        const { data, error } = await supabase
          .from('page_footers')
          .insert({
            page_id: `page-${pageNumber}`,
            footer_template_id: templateId,
            is_enabled: isEnabled,
            page_number: pageNumber
          })
          .select()
          .single();
        
        if (error) throw error;
        setPageFooters(prev => [...prev, data]);
      }

      toast({
        title: "Succes",
        description: `Footer voor pagina ${pageNumber} bijgewerkt`,
      });
    } catch (error) {
      console.error('Error toggling page footer:', error);
      toast({
        title: "Fout",
        description: "Kon footer instelling niet bijwerken",
        variant: "destructive",
      });
    }
  };

  const getPageFooterStatus = (pageNumber: number) => {
    const footer = pageFooters.find(pf => pf.page_number === pageNumber);
    return footer ? { isEnabled: footer.is_enabled, templateId: footer.footer_template_id } : { isEnabled: false, templateId: null };
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading footer templates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Footer Templates Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Footer Templates</CardTitle>
              <p className="text-muted-foreground">Beheer footer templates voor PDF pagina's</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>Beschrijving</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Logo/Afbeelding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    {editingTemplate === template.id ? (
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      template.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTemplate === template.id ? (
                      <Input
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    ) : (
                      template.description || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTemplate === template.id ? (
                      <Select 
                        value={editData.template_type || 'components'} 
                        onValueChange={(value) => setEditData(prev => ({ ...prev, template_type: value as 'components' | 'full_image' }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="components">Componenten (Logo + Paginanummer)</SelectItem>
                          <SelectItem value="full_image">Volledige Afbeelding</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">
                        {template.template_type === 'full_image' ? 'Volledige Afbeelding' : 'Componenten'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTemplate === template.id ? (
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedLogo(file);
                          }}
                          className="mb-2"
                        />
                        {(template.logo_url || template.full_image_url) && (
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-xs text-muted-foreground">
                              Huidige {template.template_type === 'full_image' ? 'afbeelding' : 'logo'} behouden als geen nieuw bestand gekozen
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      (template.logo_url || template.full_image_url) ? (
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">
                            {template.template_type === 'full_image' ? 'Afbeelding' : 'Logo'} aanwezig
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Geen {template.template_type === 'full_image' ? 'afbeelding' : 'logo'}
                        </span>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {template.is_default ? (
                      <Badge variant="default">Standaard</Badge>
                    ) : (
                      <Badge variant="secondary">Aangepast</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTemplate === template.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleUpdateTemplate}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingTemplate(null);
                          setEditData({});
                          setSelectedLogo(null);
                        }}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingTemplate(template.id);
                            setEditData(template);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!template.is_default && (
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Page Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Instellingen per Pagina</CardTitle>
          <p className="text-muted-foreground">Schakel footers in/uit per PDF pagina</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((pageNumber) => {
              const { isEnabled, templateId } = getPageFooterStatus(pageNumber);
              return (
                <Card key={pageNumber} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Pagina {pageNumber}</h4>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => {
                        const defaultTemplate = templates.find(t => t.is_default);
                        if (defaultTemplate) {
                          togglePageFooter(pageNumber, defaultTemplate.id, checked);
                        }
                      }}
                    />
                  </div>
                  {isEnabled && (
                    <Select
                      value={templateId || ''}
                      onValueChange={(value) => togglePageFooter(pageNumber, value, true)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Template Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Footer Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="template-name">Template Naam</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="bijv. Modern Footer"
                />
              </div>
              <div>
                <Label htmlFor="template-type">Template Type</Label>
                <Select 
                  value={newTemplate.template_type} 
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, template_type: value as 'components' | 'full_image' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="components">Componenten (Logo + Paginanummer)</SelectItem>
                    <SelectItem value="full_image">Volledige Afbeelding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="template-description">Beschrijving</Label>
                <Input
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschrijving van de footer template"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="logo-upload">
                {newTemplate.template_type === 'full_image' ? 'Volledige Footer Afbeelding' : 'Logo Upload'}
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedLogo(file);
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {newTemplate.template_type === 'full_image' 
                  ? 'Upload een volledige footer afbeelding die de gehele voeterbreedte vult' 
                  : 'Upload een logo voor de footer (PNG, JPG, SVG)'
                }
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowCreateForm(false);
                setSelectedLogo(null);
              }}>
                Annuleren
              </Button>
              <Button onClick={handleCreateTemplate}>
                Template Aanmaken
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}