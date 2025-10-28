'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Search, Users, Calendar, ShoppingCart, Eye, Trash2, Loader2, User, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/admin-service';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

interface UsersResponse {
  users: UserData[];
  total: number;
  stats: {
    totalUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
}

export default function UsersPage() {
  const { state } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View user detail state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  // Success message
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Chỉ fetch data khi đã có auth state và user đã đăng nhập
    if (!state.isLoading && state.isAuthenticated) {
      fetchUsers();
    } else if (!state.isLoading && !state.isAuthenticated) {
      setError('Bạn cần đăng nhập để truy cập trang này.');
      setLoading(false);
    }
  }, [state.isLoading, state.isAuthenticated]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('auth_token'); // Sử dụng đúng key
      
      if (!token) {
        throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      }
      
      console.log('Fetching users with token:', token?.substring(0, 20) + '...');
      
      // Tạo AbortController để timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch('http://localhost:5000/api/v1/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập. Cần quyền admin.');
        } else if (response.status === 500) {
          throw new Error('Lỗi server. Vui lòng kiểm tra xem backend có đang chạy không.');
        } else {
          throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu người dùng`);
        }
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if (data.success) {
        setUsers(data.data.users);
        setStats(data.data.stats);
      } else {
        throw new Error(data.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Nếu lỗi do network (server không chạy)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Request timeout. Server mất quá nhiều thời gian để phản hồi.');
      } else {
        setError(error instanceof Error ? error.message : 'Lỗi không xác định');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open view dialog
  const openViewDialog = (user: UserData) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    setDeleteError('');
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteError('');

      await adminService.deleteUser(Number(userToDelete.id));

      // Remove user from list
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setStats({
        ...stats,
        totalUsers: stats.totalUsers - 1
      });

      // Show success message
      setSuccessMessage(`Đã xóa người dùng "${userToDelete.name}" thành công`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Close dialog
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Delete user error:', error);
      setDeleteError(error.message || 'Không thể xóa người dùng. Vui lòng thử lại.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Early return nếu đang loading auth state
  if (state.isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div>Đang kiểm tra phiên đăng nhập...</div>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500">
              Debug: isAuthenticated={String(state.isAuthenticated)}, 
              isLoading={String(state.isLoading)}, 
              user={state.user?.name || 'none'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check nếu không authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600">
            <p className="text-lg font-semibold">⚠️ Chưa đăng nhập</p>
            <p className="text-sm">Bạn cần đăng nhập để truy cập trang này.</p>
          </div>
          <Button onClick={() => router.push('/auth/login')}>
            Đến trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div>Đang tải dữ liệu...</div>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500">
              Debug: isAuthenticated={String(state.isAuthenticated)}, 
              isLoading={String(state.isLoading)}, 
              user={state.user?.name || 'none'}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600">
            <p className="text-lg font-semibold">⚠️ Có lỗi xảy ra</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-4">
            <Button onClick={fetchUsers}>
              Thử lại
            </Button>
            {error.includes('đăng nhập') && (
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/login')}
              >
                Đăng nhập lại
              </Button>
            )}
            {error.includes('server') && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('http://localhost:5000/health', '_blank')}
                >
                  Kiểm tra server
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/system-status')}
                >
                  Trạng thái hệ thống
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 space-y-8">
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🔧 Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <p>Auth Loading: {String(state.isLoading)}</p>
              <p>Is Authenticated: {String(state.isAuthenticated)}</p>
              <p>User: {state.user?.name || 'null'} ({state.user?.role || 'no role'})</p>
              <p>Auth Token: {localStorage.getItem('auth_token') ? 'Có' : 'Không có'}</p>
              <p>User Data: {localStorage.getItem('user_data') ? 'Có' : 'Không có'}</p>
              <Button 
                size="sm" 
                onClick={() => {
                  const token = localStorage.getItem('auth_token');
                  const userData = localStorage.getItem('user_data');
                  console.log('Token:', token);
                  console.log('User Data:', userData);
                  if (userData) {
                    try {
                      const parsed = JSON.parse(userData);
                      console.log('Parsed User:', parsed);
                    } catch (e) {
                      console.error('Parse error:', e);
                    }
                  }
                }}
              >
                Log Token Info
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Xem và quản lý thông tin người dùng</p>
        </div>
        <Button onClick={fetchUsers}>
          Làm mới
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đăng ký tuần này</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đăng ký tháng này</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tìm kiếm */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danh sách người dùng */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Thông tin chi tiết của tất cả người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((userData) => (
              <div
                key={userData.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{userData.name}</h3>
                      <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                        {userData.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📧 {userData.email}</p>
                      {userData.phone && <p>📞 {userData.phone}</p>}
                      {userData.address && <p>📍 {userData.address}</p>}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Đăng ký: {formatDate(userData.created_at)}</span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {userData.total_orders} đơn hàng
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(userData)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(userData)}
                      className="text-destructive hover:text-destructive"
                      disabled={userData.role === 'admin' && userData.email === state.user?.email}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View User Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về người dùng
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{selectedUser.name}</h3>
                  <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                    {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <p className="mt-1">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </label>
                    <p className="mt-1">{selectedUser.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </label>
                  <p className="mt-1">{selectedUser.address || "Chưa cập nhật"}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày tham gia
                    </label>
                    <p className="mt-1">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cập nhật lần cuối
                    </label>
                    <p className="mt-1">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Tổng đơn hàng
                  </label>
                  <p className="mt-1 text-2xl font-bold text-primary">{selectedUser.total_orders}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID người dùng</label>
                  <p className="mt-1 font-mono text-sm">{selectedUser.id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.name}</strong>?
              <br />
              <br />
              <span className="text-destructive font-medium">
                ⚠️ Hành động này không thể hoàn tác!
              </span>
              <br />
              Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa người dùng"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </ProtectedRoute>
  );
}