
// 'use client';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import { createClient } from "@/lib/supabase/client";
// import Image from 'next/image';
// import AddEntryDrawer from './add-entry-drawer';
// import EditEntryDrawer from './edit-entry-drawer';

// interface Entry {
//   id: number;
//   title: string;
//   content: string;
//   created_at: string;
//   image_url?: string;
// }

// export default function Dashboard() {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isEdit, setEdit] = useState(false);
//   const [selectedId, setSelectedId] = useState<number>();
//   const [selectedEntry, setSelectedEntry] = useState<Entry>();
//   const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
  
//   const observerRef = useRef<HTMLDivElement | null>(null);
//   const fetchedIdsRef = useRef<Set<number>>(new Set());
//   const supabase = createClient();

//   const fetchEntries = useCallback(async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
    
//     try {
//       const { data, error } = await supabase
//         .from('entries')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .range(page * 5, page * 5 + 4);
        
//       if (error) {
//         console.error('Fetch error:', error);
//       } else {
//         const newEntries = data.filter((entry) => {
//           if (fetchedIdsRef.current.has(entry.id)) {
//             return false;
//           } else {
//             fetchedIdsRef.current.add(entry.id);
//             return true;
//           }
//         });
        
//         if (newEntries.length < 5) setHasMore(false);
//         setEntries((prev) => [...prev, ...newEntries]);
//         setPage((prev) => prev + 1);
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, loading, hasMore, supabase]);

//   const refreshAllEntries = useCallback(async () => {
//     setLoading(true);
    
//     // Reset all state
//     setEntries([]);
//     setPage(0);
//     setHasMore(true);
//     fetchedIdsRef.current.clear();
    
//     try {
//       const { data, error } = await supabase
//         .from('entries')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .range(0, 4);
        
//       if (error) {
//         console.error('Refresh error:', error);
//       } else {
//         data.forEach(entry => fetchedIdsRef.current.add(entry.id));
        
//         setEntries(data);
//         setPage(1); 
//         setHasMore(data.length === 5); 
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [supabase]);

//   const handleDelete = async (entryId: number) => {
//     if (deleteLoading) return;
    
//     setDeleteLoading(entryId);
    
//     try {
//       const { error } = await supabase
//         .from('entries')
//         .delete()
//         .eq('id', entryId);
        
//       if (error) {
//         console.error('Delete error:', error);
//         alert('Failed to delete entry. Please try again.');
//       } else {
//         setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
//         fetchedIdsRef.current.delete(entryId);
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error);
//       alert('Failed to delete entry. Please try again.');
//     } finally {
//       setDeleteLoading(null);
//       setShowDeleteModal(false);
//       setEntryToDelete(null);
//     }
//   };

//   const handleDeleteClick = (entry: Entry) => {
//     setEntryToDelete(entry);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false);
//     setEntryToDelete(null);
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   useEffect(() => {
//     if (!observerRef.current) return;
//     const observer = new IntersectionObserver((entriesObs) => {
//       if (entriesObs[0].isIntersecting) {
//         fetchEntries();
//       }
//     });
//     observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [fetchEntries]);

//   const handleDrawerClose = () => {
//     setDrawerOpen(false);
//     setEdit(false);
//     refreshAllEntries();
//   };

//   useEffect(() => {
//     const filteredEntry = entries.find((item) => item?.id === selectedId);
//     setSelectedEntry(filteredEntry);
//   }, [selectedId, entries]);

//   const handleDrawerEdit = (id: number) => {
//     setEdit(true);
//     setSelectedId(id);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
//       {/* Fixed Header - Full Width */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 w-full">
//         <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 min-h-0">
//             <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-800 truncate pr-2">
//               Team Journal
//             </h1>
//             <button 
//               onClick={() => setDrawerOpen(true)} 
//               className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-6 lg:py-3 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-1 whitespace-nowrap flex-shrink-0"
//             >
//               <span className="text-sm sm:text-base md:text-lg">+</span>
//               <span className="hidden sm:inline">Add Entry</span>
//               <span className="sm:hidden">Add</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Drawers */}
//       <AddEntryDrawer
//         isOpen={drawerOpen}
//         onClose={handleDrawerClose}
//         refreshEntries={refreshAllEntries}
//       />
      
//       <EditEntryDrawer
//         entry={selectedEntry}
//         isOpen={isEdit}
//         onClose={handleDrawerClose}
//         refreshEntries={refreshAllEntries}
//       />

//       {/* Main Content - Full Width */}
//       <main className="w-full pt-14 sm:pt-16 md:pt-20 min-h-screen">
//         <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
//           <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
//             {/* Empty State */}
//             {entries.length === 0 && !loading && (
//               <div className="text-center py-8 sm:py-12 md:py-16 w-full">
//                 <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4">📝</div>
//                 <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">No entries yet</p>
//                 <p className="text-gray-400 text-xs sm:text-sm md:text-base px-4">Create your first journal entry to get started!</p>
//               </div>
//             )}

//             {/* Entry Cards - Full Width */}
//             {entries.map((entry) => (
//               <article
//                 key={entry.id}
//                 className="w-full bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
//               >
//                 <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
//                   {/* Mobile Layout (Stack Vertically) */}
//                   <div className="block sm:hidden w-full">
//                     {/* Mobile Image */}
//                     <div className="w-full h-32 mb-3">
//                       <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
//                         {entry.image_url ? (
//                           <Image
//                             src={entry.image_url}
//                             alt={`Image for ${entry.title}`}
//                             width={320}
//                             height={128}
//                             className="object-cover w-full h-full"
//                             loading="lazy"
//                           />
//                         ) : (
//                           <div className="text-gray-400 text-center">
//                             <div className="text-2xl mb-1">📄</div>
//                             <div className="text-xs font-medium">No image</div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Mobile Content */}
//                     <div className="w-full">
//                       <h2 className="text-base font-bold text-gray-900 mb-2 break-words leading-tight">
//                         {entry.title}
//                       </h2>
//                       <p className="text-xs text-gray-500 mb-2 font-medium flex items-center">
//                         <span className="mr-1">📅</span>
//                         {new Date(entry.created_at).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </p>
//                       <div className="text-gray-600 mb-3">
//                         <p className="break-words line-clamp-3 text-sm leading-relaxed">
//                           {entry.content}
//                         </p>
//                       </div>
                      
//                       {/* Mobile Buttons */}
//                       <div className="flex gap-2 w-full">
//                         <button 
//                           onClick={() => handleDrawerEdit(entry.id)} 
//                           className="flex-1 bg-blue-50 border-2 border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1"
//                         >
//                           <span>✏️</span>
//                           <span>Edit</span>
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteClick(entry)}
//                           disabled={deleteLoading === entry.id}
//                           className="flex-1 bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {deleteLoading === entry.id ? (
//                             <>
//                               <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
//                               <span>...</span>
//                             </>
//                           ) : (
//                             <>
//                               <span>🗑️</span>
//                               <span>Delete</span>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Desktop/Tablet Layout (Side by Side) */}
//                   <div className="hidden sm:flex w-full gap-4 md:gap-6">
//                     {/* Desktop Image */}
//                     <div className="w-24 sm:w-28 md:w-32 lg:w-40 h-24 sm:h-28 md:h-32 lg:h-40 flex-shrink-0">
//                       <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
//                         {entry.image_url ? (
//                           <Image
//                             src={entry.image_url}
//                             alt={`Image for ${entry.title}`}
//                             width={160}
//                             height={160}
//                             className="object-cover w-full h-full"
//                             loading="lazy"
//                           />
//                         ) : (
//                           <div className="text-gray-400 text-center">
//                             <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📄</div>
//                             <div className="text-xs sm:text-sm font-medium">No image</div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Desktop Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="mb-4 sm:mb-6">
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 break-words leading-tight">
//                           {entry.title}
//                         </h2>
//                         <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 font-medium flex items-center">
//                           <span className="mr-1">📅</span>
//                           {new Date(entry.created_at).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </p>
//                         <div className="text-gray-600">
//                           <p className="break-words line-clamp-3 text-sm sm:text-base leading-relaxed">
//                             {entry.content}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Desktop Action Buttons */}
//                       <div className="flex gap-3 sm:gap-4">
//                         <button 
//                           onClick={() => handleDrawerEdit(entry.id)} 
//                           className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm sm:text-base font-medium flex items-center space-x-2"
//                         >
//                           <span>✏️</span>
//                           <span>Edit</span>
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteClick(entry)}
//                           disabled={deleteLoading === entry.id}
//                           className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm sm:text-base font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {deleteLoading === entry.id ? (
//                             <>
//                               <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-red-500"></div>
//                               <span>Deleting...</span>
//                             </>
//                           ) : (
//                             <>
//                               <span>🗑️</span>
//                               <span>Delete</span>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}

//             {/* Infinite Scroll Trigger */}
//             <div
//               ref={observerRef}
//               className="h-12 sm:h-16 md:h-20 flex items-center justify-center text-gray-500 w-full"
//             >
//               {loading && (
//                 <div className="flex items-center space-x-2 text-xs sm:text-sm md:text-base">
//                   <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 border-b-2 border-blue-500"></div>
//                   <span>Loading more entries...</span>
//                 </div>
//               )}
//               {!hasMore && entries.length > 0 && (
//                 <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm md:text-base">
//                   <span>✨</span>
//                   <span>You've reached the end</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && entryToDelete && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//             onClick={handleDeleteCancel}
//           ></div>
          
//           {/* Modal Container */}
//           <div className="flex min-h-full items-center justify-center p-4">
//             <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
//               {/* Modal Header */}
//               <div className="p-6 pb-4">
//                 <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
//                   <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//                   </svg>
//                 </div>
                
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
//                   Delete Entry
//                 </h3>
                
//                 <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
//                   Are you sure you want to delete this entry? This action cannot be undone.
//                 </p>
                
//                 {/* Entry Preview */}
//                 <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-200">
//                   <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
//                     {entryToDelete.title}
//                   </h4>
//                   <p className="text-xs text-gray-500 mb-2">
//                     📅 {new Date(entryToDelete.created_at).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
//                     {entryToDelete.content}
//                   </p>
//                 </div>
//               </div>

//               {/* Modal Actions */}
//               <div className="px-6 pb-6">
//                 <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 sm:space-y-0">
//                   <button
//                     onClick={handleDeleteCancel}
//                     disabled={deleteLoading === entryToDelete.id}
//                     className="flex-1 px-4 py-2.5 text-sm sm:text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Cancel
//                   </button>
                  
//                   <button
//                     onClick={() => handleDelete(entryToDelete.id)}
//                     disabled={deleteLoading === entryToDelete.id}
//                     className="flex-1 px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                   >
//                     {deleteLoading === entryToDelete.id ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Deleting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>🗑️</span>
//                         <span>Delete Entry</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom Styles */}
//       <style jsx>{`
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
        
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
        
//         /* Ensure no horizontal scroll */
//         * {
//           box-sizing: border-box;
//         }
        
//         html, body {
//           overflow-x: hidden;
//         }
        
//         /* Modal animation */
//         @keyframes modalFadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         .modal-enter {
//           animation: modalFadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }




'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";
import Image from 'next/image';
import AddEntryDrawer from './add-entry-drawer';
import EditEntryDrawer from './edit-entry-drawer';

interface Entry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedEntry, setSelectedEntry] = useState<Entry>();
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const observerRef = useRef<HTMLDivElement | null>(null);
  const fetchedIdsRef = useRef<Set<number>>(new Set());
  const supabase = createClient();

  // Fetch total count
  const fetchTotalCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error('Count fetch error:', error);
      } else {
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Unexpected error fetching count:', error);
    }
  }, [supabase]);

  // Search entries
  const searchEntries = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredEntries([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Search error:', error);
      } else {
        setFilteredEntries(data || []);
      }
    } catch (error) {
      console.error('Unexpected search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [supabase]);

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchEntries(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchEntries]);

  const fetchEntries = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * 5, page * 5 + 4);
        
      if (error) {
        console.error('Fetch error:', error);
      } else {
        const newEntries = data.filter((entry) => {
          if (fetchedIdsRef.current.has(entry.id)) {
            return false;
          } else {
            fetchedIdsRef.current.add(entry.id);
            return true;
          }
        });
        
        if (newEntries.length < 5) setHasMore(false);
        setEntries((prev) => [...prev, ...newEntries]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, supabase]);

  const refreshAllEntries = useCallback(async () => {
    setLoading(true);
    
    // Reset all state
    setEntries([]);
    setPage(0);
    setHasMore(true);
    fetchedIdsRef.current.clear();
    
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 4);
        
      if (error) {
        console.error('Refresh error:', error);
      } else {
        data.forEach(entry => fetchedIdsRef.current.add(entry.id));
        
        setEntries(data);
        setPage(1); 
        setHasMore(data.length === 5); 
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
    
    // Refresh total count
    fetchTotalCount();
  }, [supabase, fetchTotalCount]);

  const handleDelete = async (entryId: number) => {
    if (deleteLoading) return;
    
    setDeleteLoading(entryId);
    
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId);
        
      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete entry. Please try again.');
      } else {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
        setFilteredEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
        fetchedIdsRef.current.delete(entryId);
        setTotalCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Failed to delete entry. Please try again.');
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(false);
      setEntryToDelete(null);
    }
  };

  const handleDeleteClick = (entry: Entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    fetchEntries();
    fetchTotalCount();
  }, []);

  useEffect(() => {
    if (!observerRef.current || searchQuery.trim()) return;
    const observer = new IntersectionObserver((entriesObs) => {
      if (entriesObs[0].isIntersecting) {
        fetchEntries();
      }
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchEntries, searchQuery]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEdit(false);
    refreshAllEntries();
  };

  useEffect(() => {
    const currentEntries = searchQuery.trim() ? filteredEntries : entries;
    const filteredEntry = currentEntries.find((item) => item?.id === selectedId);
    setSelectedEntry(filteredEntry);
  }, [selectedId, entries, filteredEntries, searchQuery]);

  const handleDrawerEdit = (id: number) => {
    setEdit(true);
    setSelectedId(id);
  };

  // Get current display entries
  const displayEntries = searchQuery.trim() ? filteredEntries : entries;
  const currentCount = displayEntries.length;

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Fixed Header - Full Width */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 min-h-0">
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-800 truncate pr-2">
              Team Journal
            </h1>
            <button 
              onClick={() => setDrawerOpen(true)} 
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-6 lg:py-3 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-1 whitespace-nowrap flex-shrink-0"
            >
              <span className="text-sm sm:text-base md:text-lg">+</span>
              <span className="hidden sm:inline">Add Entry</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Count Bar */}
      <div className="fixed top-14 sm:top-16 md:top-20 left-0 right-0 z-40 bg-white border-b border-gray-100 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Entry Count - Left Side */}
            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600 font-medium">
              <span className="text-blue-600">📊</span>
              <span>
                {searchQuery.trim() ? (
                  <span>
                    <span className="text-blue-700 font-bold">{currentCount}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-500">{totalCount}</span>
                    <span className="text-gray-400 ml-1 text-xs sm:text-sm">found</span>
                  </span>
                ) : (
                  <span>
                    <span className="text-blue-700 font-bold">{currentCount}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-500">{totalCount}</span>
                  </span>
                )}
              </span>
            </div>

            {/* Search Field - Right Side */}
            <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <AddEntryDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        refreshEntries={refreshAllEntries}
      />
      
      <EditEntryDrawer
        entry={selectedEntry}
        isOpen={isEdit}
        onClose={handleDrawerClose}
        refreshEntries={refreshAllEntries}
      />

      {/* Main Content - Full Width */}
      <main className="w-full pt-28 sm:pt-32 md:pt-36 min-h-screen">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Search Results Header */}
            {searchQuery.trim() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🔍</span>
                    <span className="text-sm sm:text-base text-blue-800 font-medium">
                      Search results for "{searchQuery}"
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {displayEntries.length === 0 && !loading && !isSearching && (
              <div className="text-center py-8 sm:py-12 md:py-16 w-full">
                <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4">
                  {searchQuery.trim() ? '🔍' : '📝'}
                </div>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                  {searchQuery.trim() ? 'No entries found' : 'No entries yet'}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base px-4">
                  {searchQuery.trim() 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first journal entry to get started!'
                  }
                </p>
              </div>
            )}

            {/* Entry Cards - Full Width */}
            {displayEntries.map((entry) => (
              <article
                key={entry.id}
                className="w-full bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
                  {/* Mobile Layout (Stack Vertically) */}
                  <div className="block sm:hidden w-full">
                    {/* Mobile Image */}
                    <div className="w-full h-32 mb-3">
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        {entry.image_url ? (
                          <Image
                            src={entry.image_url}
                            alt={`Image for ${entry.title}`}
                            width={320}
                            height={128}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <div className="text-2xl mb-1">📄</div>
                            <div className="text-xs font-medium">No image</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Content */}
                    <div className="w-full">
                      <h2 className="text-base font-bold text-gray-900 mb-2 break-words leading-tight">
                        {entry.title}
                      </h2>
                      <p className="text-xs text-gray-500 mb-2 font-medium flex items-center">
                        <span className="mr-1">📅</span>
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="text-gray-600 mb-3">
                        <p className="break-words line-clamp-3 text-sm leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                      
                      {/* Mobile Buttons */}
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleDrawerEdit(entry.id)} 
                          className="flex-1 bg-blue-50 border-2 border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(entry)}
                          disabled={deleteLoading === entry.id}
                          className="flex-1 bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === entry.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                              <span>...</span>
                            </>
                          ) : (
                            <>
                              <span>🗑️</span>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop/Tablet Layout (Side by Side) */}
                  <div className="hidden sm:flex w-full gap-4 md:gap-6">
                    {/* Desktop Image */}
                    <div className="w-24 sm:w-28 md:w-32 lg:w-40 h-24 sm:h-28 md:h-32 lg:h-40 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                        {entry.image_url ? (
                          <Image
                            src={entry.image_url}
                            alt={`Image for ${entry.title}`}
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📄</div>
                            <div className="text-xs sm:text-sm font-medium">No image</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 break-words leading-tight">
                          {entry.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 font-medium flex items-center">
                          <span className="mr-1">📅</span>
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="text-gray-600">
                          <p className="break-words line-clamp-3 text-sm sm:text-base leading-relaxed">
                            {entry.content}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Action Buttons */}
                      <div className="flex gap-3 sm:gap-4">
                        <button 
                          onClick={() => handleDrawerEdit(entry.id)} 
                          className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm sm:text-base font-medium flex items-center space-x-2"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(entry)}
                          disabled={deleteLoading === entry.id}
                          className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 text-sm sm:text-base font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === entry.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-red-500"></div>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <span>🗑️</span>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Infinite Scroll Trigger - Only show when not searching */}
            {!searchQuery.trim() && (
              <div
                ref={observerRef}
                className="h-12 sm:h-16 md:h-20 flex items-center justify-center text-gray-500 w-full"
              >
                {loading && (
                  <div className="flex items-center space-x-2 text-xs sm:text-sm md:text-base">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 border-b-2 border-blue-500"></div>
                    <span>Loading more entries...</span>
                  </div>
                )}
                {!hasMore && entries.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm md:text-base">
                    <span>✨</span>
                    <span>You've reached the end</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && entryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={handleDeleteCancel}
          ></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                  Delete Entry
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
                  Are you sure you want to delete this entry? This action cannot be undone.
                </p>
                
                {/* Entry Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {entryToDelete.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    📅 {new Date(entryToDelete.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {entryToDelete.content}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 sm:space-y-0">
                  <button
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading === entryToDelete.id}
                    className="flex-1 px-4 py-2.5 text-sm sm:text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={() => handleDelete(entryToDelete.id)}
                    disabled={deleteLoading === entryToDelete.id}
                    className="flex-1 px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {deleteLoading === entryToDelete.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        <span>Delete Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Ensure no horizontal scroll */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          overflow-x: hidden;
        }
        
        /* Modal animation */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .modal-enter {
          animation: modalFadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}