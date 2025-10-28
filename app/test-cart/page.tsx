'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/lib/cart-context';
import { Plus, Minus } from 'lucide-react';

// Mock product để test
const testProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Product để test cart',
  price: 100000,
  image: '/placeholder.svg',
  category: 'test',
  in_stock: true,
  stock_quantity: 10
};

export default function CartTestPage() {
  const { state, addItem, updateQuantity, removeItem } = useCart();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleAddToCart = () => {
    addLog('Thêm sản phẩm vào cart');
    addItem(testProduct, 1);
  };

  const handleIncrease = (productId: string, currentQuantity: number) => {
    addLog(`🔺 TĂNG: ${productId}, từ ${currentQuantity} → ${currentQuantity + 1}`);
    const newQuantity = currentQuantity + 1;
    updateQuantity(productId, newQuantity);
    
    // Verify the change
    setTimeout(() => {
      const currentItem = state.items.find(item => item.product_id === productId);
      if (currentItem) {
        addLog(`✅ Verified: quantity is now ${currentItem.quantity}`);
      } else {
        addLog(`❌ Item not found after update`);
      }
    }, 100);
  };

  const handleDecrease = (productId: string, currentQuantity: number) => {
    addLog(`🔻 GIẢM: ${productId}, từ ${currentQuantity} → ${currentQuantity - 1}`);
    updateQuantity(productId, currentQuantity - 1);
  };

  const handleClearCart = () => {
    addLog('🗑️ Xóa toàn bộ cart');
    state.items.forEach(item => removeItem(item.product_id));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">🧪 Cart Debug Test</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{state.items.length}</div>
            <div className="text-sm text-muted-foreground">Items</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{state.itemCount}</div>
            <div className="text-sm text-muted-foreground">Total Qty</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{state.total.toLocaleString('vi-VN')}đ</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleAddToCart}>
              ➕ Add Test Product
            </Button>
            
            <Button variant="destructive" onClick={handleClearCart}>
              🗑️ Clear Cart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle>🛒 Cart Items ({state.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {state.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Cart trống - click "Add Test Product" để thêm
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product_id} className="border p-4 rounded bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>🆔 Product ID: <code>{item.product_id}</code></p>
                        <p>💰 Unit Price: {item.product.price.toLocaleString('vi-VN')}đ</p>
                        <p>💎 Line Total: {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-4 bg-white p-4 rounded border">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleDecrease(item.product_id, item.quantity)}
                      disabled={item.quantity <= 1}
                      className="h-12 w-12"
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    
                    <div className="text-center min-w-[80px]">
                      <div className="text-3xl font-bold">{item.quantity}</div>
                      <div className="text-xs text-muted-foreground">quantity</div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleIncrease(item.product_id, item.quantity)}
                      className="h-12 w-12 border-green-300 hover:bg-green-50"
                    >
                      <Plus className="h-6 w-6 text-green-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>📝 Debug Logs</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLogs([])}
          >
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded text-sm font-mono max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Waiting for actions...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}