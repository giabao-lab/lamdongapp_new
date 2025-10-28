'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Server } from 'lucide-react';

export default function ServerStatusPage() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkServerStatus = async () => {
    setServerStatus('checking');
    setDbStatus('checking');
    
    try {
      // Check server health
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
      });
      
      if (response.ok) {
        setServerStatus('online');
        const data = await response.json();
        console.log('Server health:', data);
        
        // If server is online, database should be too
        setDbStatus('online');
      } else {
        setServerStatus('offline');
        setDbStatus('offline');
      }
    } catch (error) {
      console.error('Server check failed:', error);
      setServerStatus('offline');
      setDbStatus('offline');
    }
    
    setLastChecked(new Date());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'checking':
        return <Badge variant="secondary">Đang kiểm tra...</Badge>;
      default:
        return <Badge variant="outline">Chưa kiểm tra</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trạng thái hệ thống</h1>
          <p className="text-muted-foreground">Kiểm tra trạng thái server và database</p>
        </div>
        <Button onClick={checkServerStatus}>
          Kiểm tra lại
        </Button>
      </div>

      {lastChecked && (
        <p className="text-sm text-muted-foreground">
          Kiểm tra lần cuối: {lastChecked.toLocaleString('vi-VN')}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Backend Server
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Trạng thái:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(serverStatus)}
                {getStatusBadge(serverStatus)}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>URL: http://localhost:5000</p>
              <p>Health Check: http://localhost:5000/health</p>
            </div>

            {serverStatus === 'offline' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-semibold text-red-800">Server không hoạt động</p>
                <p className="text-red-600">Hãy chạy lệnh: <code>cd backend && npm run dev</code></p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Trạng thái:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(dbStatus)}
                {getStatusBadge(dbStatus)}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Host: localhost:5432</p>
              <p>Database: lamdongapp_new</p>
            </div>

            {dbStatus === 'offline' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-semibold text-red-800">Database không kết nối được</p>
                <p className="text-red-600">Kiểm tra PostgreSQL có đang chạy không</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn khắc phục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">1. Khởi động Backend Server:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              cd backend && npm run dev
            </code>
          </div>
          
          <div>
            <h4 className="font-semibold">2. Kiểm tra PostgreSQL:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              psql -h localhost -p 5432 -U postgres -d lamdongapp_new
            </code>
          </div>
          
          <div>
            <h4 className="font-semibold">3. Kiểm tra Frontend:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              npm run dev
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}