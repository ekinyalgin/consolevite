import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Trash2, Edit, Clock, Check, Plus, XCircle, ExternalLink } from 'lucide-react';

export const tableClasses = {

  h1: "text-3xl font-bold mb-6",
  h2: "text-sm font-semibold text-gray-800 mb-2",
  // Genel table container
  container: "w-full oxverflow-hidden bg-white shadow-md rounded-lg",
  title: "text-3xl font-bold text-gray-800 mb-6",
  addButton: "uppercase bg-blue-500 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider px-4 py-2 rounded transition",
  filterContainer: "text-sm flex justify-between items-center mb-4 space-x-4",
  buttonContainer: "text-sm flex items-center mb-4 space-x-4",
  filterInput: "w-4/12 p-2 pl-3 font-lg shadow border border-gray-300 rounded",
  filterSelect: "p-2 shadow border border-gray-300 rounded",
  
  // Tablo
  table: "bg-white w-full shadow-sm rounded",
  tableHeader: "bg-gray-100 text-xs font-semibold uppercase py-2 text-gray-400 border-b border-gray-100",
  tableBody: "bg-white divide-y divide-gray-200",
  tableRow: "hover:bg-gray-50",
  tableTitle: "border-b border-gray-100 text-left text-sm font-semibold px-2",
  //tableCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-700",
  tableCell: "border-b border-gray-100 h-10 text-center px-2 text-xs text-gray-700",
  tableCellExpanded: "px-8 py-2 text-xs",
  
  // Action Buttons Container
  actionContainer: "flex space-x-4",

  // İkon stilleri
  doneIcon: "text-green-500 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Done ikonu
  notDoneIcon: "text-gray-400 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Not Done ikonu
  randomIcon: "text-purple-500 hover:text-pfformButtonurple-700 cursor-pointer transition transform hover:scale-110 ease-in-out duration-300", // Random video ikonu
  noteIcon: "cursor-pointer text-gray-600 hover:text-green-800 w-4  transition transform hover:scale-110 ease-in-out duration-300",
  downloadIcon: "cursor-pointer text-gray-500 hover:text-blue-600 w-4 transition transform hover:scale-110 ease-in-out duration-300", 
  editIcon: "cursor-pointer text-blue-500 hover:text-blue-600 w-4 transition transform hover:scale-110 ease-in-out duration-300", 
  deleteIcon: "cursor-pointer text-red-500 hover:text-red-600 w-4 transition transform hover:scale-110 ease-in-out duration-300",
  checkIcon: "cursor-pointer text-green-500 hover:text-green-600 pt-1 w-4 transition transform hover:scale-110 ease-in-out duration-300",
  checkIconBlack: "cursor-pointer text-black hover:text-green-600 pt-1 w-4 transition transform hover:scale-110 ease-in-out duration-300",


  // Form elemanları
  formContainer: "space-y-4",
  formLabel: "block text-gray-700 text-sm font-bold mb-2",
  formInput: "w-full shadow-sm bg-gray-50 rounded font-normal py-2 px-3 text-gray-500 leading-tight focus:outline-none transition text-sm",
  formButton: "bg-blue-500 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded transition",
  cancelButton: "bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-2 rounded flex items-center justify-center",
  transButton: "bg-transparent border border-gray-500 text-black text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition",
  formDivider: "border-t border-gray-200 my-5",  

  // Pagination
  paginationContainer: "mt-6 flex justify-end space-x-4 items-center",
  paginationButton: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 cursor-pointer transition",
  paginationText: "text-sm",

  // Pagination ikon boyutu
  paginationIconSize: "w-4 h-4",
  paginationIcons: {
    Delete: Trash2,
    Done: Check,
    Edit: Edit,
    DoubleLeftArrow: ChevronsLeft,
    LeftArrow: ChevronLeft,
    RightArrow: ChevronRight,
    DoubleRightArrow: ChevronsRight,
    Pending: Clock,
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
