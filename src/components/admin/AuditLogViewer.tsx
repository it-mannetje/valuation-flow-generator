import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: any;
  new_values?: any;
  user_id?: string;
  created_at: string;
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    table: 'all',
    operation: 'all',
    limit: '50'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(parseInt(filter.limit));

      if (filter.table !== 'all') {
        query = query.eq('table_name', filter.table);
      }

      if (filter.operation !== 'all') {
        query = query.eq('operation', filter.operation);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs((data || []) as AuditLog[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Fout",
        description: "Kon audit logs niet laden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOperationBadgeVariant = (operation: string) => {
    switch (operation) {
      case 'INSERT': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      default: return 'outline';
    }
  };

  const formatChangeDetails = (oldValues: any, newValues: any, operation: string) => {
    if (operation === 'INSERT') {
      return `Nieuw record aangemaakt`;
    }
    if (operation === 'DELETE') {
      return `Record verwijderd`;
    }
    if (operation === 'UPDATE' && oldValues && newValues) {
      const changes: string[] = [];
      const keys = Object.keys(newValues);
      keys.forEach(key => {
        if (key !== 'updated_at' && oldValues[key] !== newValues[key]) {
          changes.push(`${key}: ${oldValues[key]} → ${newValues[key]}`);
        }
      });
      return changes.length > 0 ? changes.join(', ') : 'Geen wijzigingen gedetecteerd';
    }
    return 'Geen details beschikbaar';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="table-filter">Tabel</Label>
              <Select value={filter.table} onValueChange={(value) => setFilter(prev => ({ ...prev, table: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle tabellen</SelectItem>
                  <SelectItem value="pdf_pages">PDF Pagina's</SelectItem>
                  <SelectItem value="footer_templates">Footer Templates</SelectItem>
                  <SelectItem value="general_settings">Algemene Instellingen</SelectItem>
                  <SelectItem value="sector_configs">Sector Configuraties</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation-filter">Operatie</Label>
              <Select value={filter.operation} onValueChange={(value) => setFilter(prev => ({ ...prev, operation: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle operaties</SelectItem>
                  <SelectItem value="INSERT">Toevoegen</SelectItem>
                  <SelectItem value="UPDATE">Wijzigen</SelectItem>
                  <SelectItem value="DELETE">Verwijderen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="limit-filter">Aantal records</Label>
              <Select value={filter.limit} onValueChange={(value) => setFilter(prev => ({ ...prev, limit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchAuditLogs} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Vernieuwen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Audit Log
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Overzicht van alle wijzigingen aan de database configuratie
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div>Laden van audit logs...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tijdstip</TableHead>
                    <TableHead>Tabel</TableHead>
                    <TableHead>Operatie</TableHead>
                    <TableHead>Wijzigingen</TableHead>
                    <TableHead>Gebruiker ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Geen audit logs gevonden met de huidige filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(new Date(log.created_at), 'dd-MM-yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.table_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getOperationBadgeVariant(log.operation)}>
                            {log.operation}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm truncate" title={formatChangeDetails(log.old_values, log.new_values, log.operation)}>
                            {formatChangeDetails(log.old_values, log.new_values, log.operation)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground font-mono">
                            {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Systeem'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}