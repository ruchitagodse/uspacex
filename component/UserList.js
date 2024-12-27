import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjust your Firebase config path
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import "../src/app/styles/main.scss";
import { FaSearch } from "react-icons/fa";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState(''); 
    const [phoneFilter, setPhoneFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // Track which user to delete

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userCollection = collection(db, 'userdetails');
                const userSnapshot = await getDocs(userCollection);
                
                const userList = userSnapshot.docs.map(doc => ({
                    id: doc.id, // Store document ID for deletion
                    phoneNumber: doc.data()["Mobile no"],
                    name: doc.data()[" Name"],
                    role: doc.data()["Category"]
                }));

                setUsers(userList);
                setLoading(false);
            } catch (err) {
                setError('Error fetching user data.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on name and phone filters
    const filteredUsers = users.filter(user => {
        const lowerCaseNameFilter = nameFilter.toLowerCase();
        const lowerCasePhoneFilter = phoneFilter.toLowerCase();
        const lowerCaseRoleFilter = roleFilter.toLowerCase();
        const userName = user.name ? user.name.toLowerCase() : '';
        const userPhone = user.phoneNumber ? user.phoneNumber.toLowerCase() : '';
        const userRole = user.role ? user.role.toLowerCase() : '';

        return (
            userName.includes(lowerCaseNameFilter) &&
            userPhone.includes(lowerCasePhoneFilter) &&
            userRole.includes(lowerCaseRoleFilter)
        );
    });

    // Open delete confirmation modal
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalIsOpen(true);
    };

    // Close delete modal
    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setUserToDelete(null);
    };

    // Delete user from Firestore
    const deleteUser = async () => {
        if (userToDelete) {
            try {
                await deleteDoc(doc(db, 'userdetails', userToDelete.id));
                setUsers(users.filter(user => user.id !== userToDelete.id));
                closeDeleteModal();
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    return (
        <>
            <section className='c-form box'>
                <h2>User Master Table List</h2>
                <button className="m-button-5" onClick={() => window.history.back()}>
                    Back
                </button>

                {loading && <div className='loader'><span className="loader2"></span></div>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    <table className='table-class'>
                        <thead>
                            <tr>
                                <th>Sr no</th>
                                <th>Name</th>
                                <th>Mobile No</th>
                                <th>Role</th>
                                <th>Actions</th> {/* Actions column */}
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <div className="search">
                                        <input
                                            type="text"
                                            className="searchTerm"
                                            placeholder="Filter by Name" 
                                            value={nameFilter} 
                                            onChange={(e) => setNameFilter(e.target.value)} 
                                        />
                                        <button type="submit" className="searchButton">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className="search">
                                        <input
                                            type="text"
                                            className="searchTerm"
                                            placeholder="Filter by Mobile No" 
                                            value={phoneFilter} 
                                            onChange={(e) => setPhoneFilter(e.target.value)} 
                                        />
                                        <button type="submit" className="searchButton">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </th>
                                <th>
                                <div className="search">
                                        <input
                                            type="text"
                                            className="searchTerm"
                                            placeholder="Filter by Role" 
                                            value={roleFilter} 
                                            onChange={(e) => setRoleFilter(e.target.value)} 
                                        />
                                        <button type="submit" className="searchButton">
                                            <FaSearch />
                                        </button>
                                        </div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name || 'No name available'}</td>
                                        <td>{user.phoneNumber || 'No phone available'}</td>
                                        <td>{user.role || 'User'}</td> {/* You can adjust the role here */}
                                        <td>
                                            <button 
                                                className='m-button-7' 
                                                onClick={() => openDeleteModal(user)} 
                                                style={{ backgroundColor: '#f16f06', color: 'white' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModalIsOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Confirm Deletion</h2>
                            <p>Are you sure you want to delete {userToDelete?.name}?</p>
                            <div className="twobtn">
                                <button
                                    className="m-button-7"
                                    onClick={deleteUser}
                                    style={{ backgroundColor: '#f16f06', color: 'white' }}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="m-button-7"
                                    onClick={closeDeleteModal}
                                    style={{ backgroundColor: '#e2e2e2', color: 'black' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default UserList;
