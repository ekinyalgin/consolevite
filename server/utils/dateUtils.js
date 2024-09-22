// Tarih formatlamak için yardımcı fonksiyon
const formatDate = (date) => {
	if (!date) return null;
	const d = new Date(date);
	// Tarihi UTC'ye çevir
	const utcDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
	return new Date(utcDate).toISOString().split('T')[0];
  };
  
  module.exports = { formatDate };