import React from 'react';

const ExcelUrlList = ({ urls, selectedUrls, onSelectUrl, onSelectAll, onAddSelected, onAddAll }) => {
  return (
    <div className="mt-4">
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-gray-500 text-white text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 transition"
          onClick={onSelectAll}
        >
          {selectedUrls.length === urls.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          className="bg-gray-500 text-white text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 transition"
          onClick={onAddAll}
        >
          Select All and Add to Database
        </button>
      </div>
      
      {urls.length > 0 ? (
        <div className="overflow-y-auto max-h-60 shadow rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200 h-10">
              <tr>
                <th scope="col" className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map((url, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(url)}
                      onChange={() => onSelectUrl(url)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-200 mt-2 rounded-sm"
                    />
                  </td>
                  <td className="text-sm h-10 whitespace-nowrap text-sm text-gray-500">
                    {url}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No content available</div>
      )}

      {urls.length > 0 && (
        <button
          className="bg-gray-500 text-white text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 transition mt-4"
          onClick={onAddSelected}
        >
          Add Selected URLs
        </button>
      )}
    </div>
  );
};

export default ExcelUrlList;