// Tarih formatlamak için yardımcı fonksiyon
export const formatDate = (date) => {
	if (!date) return '';
	const d = new Date(date);
	// Tarihi UTC'ye çevir
	const utcDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
	return new Date(utcDate).toISOString().split('T')[0];
  };
  
  // Tarihi yerel formatta göstermek için
  export const formatDateForDisplay = (dateString) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Tarihi bir gün ileri almak için
  export const getNextDay = (date) => {
	const nextDay = new Date(date);
	nextDay.setDate(nextDay.getDate() + 1);
	return nextDay;
  };