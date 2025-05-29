import { useEffect, useState , useContext } from 'react';
import axios from 'axios';
import { AuthContext   } from '../Context/AuthContext';

const AdminDashboard = () => {

  const { users, getListUserContext , amount} = useContext(AuthContext); 
  useEffect(() => {
    
    const fetchUsers = async () => {
    try {
      await getListUserContext();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };
  fetchUsers();
  }, []);

  return (
    <div className="px-4 pt-10 max-w-screen-xl mx-auto space-y-10">
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-blue-500 text-white p-3 rounded-full">
            <i className="ri-user-line text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{users?.length}</h2>
            <p className="text-gray-600">Người dùng</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-red-500 text-white p-3 rounded-full">
            <i className="ri-book-line text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{amount} VNĐ</h2>
            <p className="text-gray-600">Số tiền</p>
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4">STT</th>
                <th className="py-2 px-4">Tên người dùng</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Vai trò</th>
                <th className="py-2 px-4">Tình trạng</th>

              </tr>
            </thead>
            <tbody className="tbody-order">
              {users?.map((user, index) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{user.user_name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>

                  <td className="py-2 px-4">
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                        user.is_premium
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    >
                    {user.is_premium ? 'Nâng cao' : 'Bình thường'}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">Không có người dùng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
