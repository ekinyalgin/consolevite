import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Trash2, Edit, Clock, Check, Plus, XCircle, ExternalLink } from 'lucide-react';

export const tableClasses = {
  // Genel table container
  container: "w-full oxverflow-hidden bg-white shadow-md rounded-lg",
  title: "text-3xl font-bold text-gray-800 mb-6",
  addButton: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block",
  filterContainer: "text-sm flex justify-between items-center mb-4 space-x-4",
  filterInput: "w-4/12 p-2 pl-3 font-lg shadow border border-gray-300 rounded",
  filterSelect: "p-2 shadow border border-gray-300 rounded",
  
  // Tablo
  table: "min-w-full bg-white divide-y divide-gray-200",
  tableHeader: "bg-gray-100",
  tableHeaderCell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "hover:bg-gray-50 transition duration-200 ease-in-out",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-700",
  
  // Action Buttons Container
  actionContainer: "flex space-x-4",

  // İkon stilleri
  doneIcon: "text-green-500 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Done ikonu
  notDoneIcon: "text-gray-400 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Not Done ikonu
  noteIcon: "text-blue-500 cursor-pointer transition transform hover:rotate-45 ease-in-out duration-300", // Note ikonu
  editIcon: "text-blue-600 hover:text-blue-800 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Edit ikonu
  deleteIcon: "text-red-600 hover:text-red-800 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Delete ikonu
  randomIcon: "text-purple-500 hover:text-purple-700 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Random video ikonu

  // Form elemanları
  formContainer: "bg-white px-8 pt-6 pb-8 mb-4 border border-gray-200 rounded-lg shadow-md",
  formLabel: "block text-gray-700 text-sm font-bold mb-2",
  formInput: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
  formButton: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
  cancelButton: "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition",
  formDivider: "border-t border-gray-200 my-5",

  // Pagination
  paginationContainer: "mt-6 flex justify-end space-x-4 items-center",
  paginationButton: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 cursor-pointer transition",
  paginationText: "text-sm",

  // Pagination ikon boyutu
  paginationIconSize: "w-4 h-4",
  paginationIcons: {
    DoubleLeftArrow: ChevronsLeft,
    LeftArrow: ChevronLeft,
    RightArrow: ChevronRight,
    DoubleRightArrow: ChevronsRight,
    Delete: Trash2,
    Edit: Edit,
    Pending: Clock,
    Done: Check,
    Plus: Plus,
    Cancel: XCircle,
    Random: ExternalLink
  },

  // Animasyon sınıfları
  transition: "transition duration-500 ease-in-out", // Genel geçiş animasyonu
  fadeIn: "transition-opacity duration-500 opacity-0", // Görünürlük değişimi için
  fadeInVisible: "opacity-100", // Opaklık için
};

export default tableClasses;
