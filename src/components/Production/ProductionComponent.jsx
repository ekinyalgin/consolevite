import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Upload, Download, Trash2 } from 'lucide-react';

const ProductionComponent = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/production');
      setVideos(response.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      await axios.post('/api/production/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchVideos();
      setFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`/api/production/${videoId}`);
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const Section = ({ id, title, children }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full text-left font-semibold text-lg bg-white text-gray-600 shadow p-3 rounded-md flex justify-between items-center"
      >
        {title}
        {openSections[id] ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {openSections[id] && (
        <div className="mt-2 bg-white p-4 rounded-md shadow-md">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="aflex production-component max-w-4xl mx-auto">
        <div className="">
      <h1 className="text-3xl font-bold mb-6 text-center">İlk Defa Yapıyorum</h1>
        <div className='space-y-4'>


          <Section id="4" title="Kendi Bilgisayarınıza Adobe Premiere Pro ve Creative Cloud Nasıl Kurulur?">
  <p className="mt-2">
    Creative Cloud İndirme Adresi:{" "}
    <a
      href="https://www.adobe.com/creativecloud/desktop-app.html"
      className="text-blue-600 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://www.adobe.com/creativecloud/desktop-app.html
    </a>
  </p>
  <ul className="list-disc pl-5 mt-2">
    <li>
      Adobe hesabınızla giriş yapın. (Kullanıcı adı ve şifreyi ben vereceğim.)
      ve "Download" butonuna tıklayarak Creative Cloud uygulamasını indirin.
    </li>
    <li>İndirilen Creative Cloud uygulamasını kurun ve başlatın.</li>
    <li>
      Uygulama içinden "Premiere Pro"yu bulun ve "Install" butonuna tıklayarak
      kurulum işlemini tamamlayın.
    </li>
  </ul>
</Section>

<Section id="7" title="Autocut Eklentisinin Kurulumu">
  <ul className="list-disc pl-5 mt-2">
  <li>
    Autocut Eklentisi İndirme Adresi:{" "}
    <a
      href="https://www.autocut.com/en/"
      className="text-blue-600 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://www.autocut.com/en/
    </a>
    </li>
    <li>İndirilen eklentiyi çalıştırarak Premiere Pro'ya kurun.</li>
    <li>Premiere Pro'yu başlatın ve yeni bir proje oluşturun ya da mevcut bir projeyi açın.</li>
    <li>Üst menüde "Window" (Pencere) sekmesine tıklayın ve ardından "Extensions" (Eklentiler) kısmına gidin.</li>
    <li>Burada "Autocut" seçeneğini göreceksiniz. Bu seçeneğe tıklayarak Autocut eklentisini başlatın. Eklenti, Premiere Pro'nun sağ panelinde açılacaktır.</li>
    <li>Autocut paneli açıldığında, genellikle "Activate Trial" veya "Start Free Trial" şeklinde bir buton göreceksiniz.</li>
    <li>Butona tıklayın ve açılan sayfada e-posta adresinizi girerek 15 günlük deneme süresini başlatın.</li>
    <li>Autocut eklentisi etkinleştirildiğinde, paneldeki seçenekler kullanıma açılacak.</li>
    <li>Videonuzu Premiere Pro’ya ekleyin ve Autocut panelinden "Analyze" veya "Start Cutting" gibi seçeneklerle videonun sessiz kısımlarını analiz ederek otomatik olarak kesmesini sağlayabilirsiniz.</li>
  </ul>
</Section>

        </div>
      </div>
        
      <div className="">
      <h1 className="text-3xl font-bold mb-6 text-center mt-10">İlk Montajı 15 Gün Önce Yaptım</h1>

      <Section id="01" title="Oracle VM VirtualBox Nasıl, Nereden İndirilir ve Kurulur?">
          <p className="mt-2">İndirme Adresi: <a href="https://www.virtualbox.org/wiki/Downloads" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.virtualbox.org/wiki/Downloads</a></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Sayfada, kullandığınız işletim sistemine uygun olan "Windows hosts" seçeneğini tıklayarak indirin.</li>
            <li>"Next" butonlarına basarak kurulum adımlarını takip edin. Varsayılan ayarları olduğu gibi bırakabilirsiniz.</li>
            <li>Kurulum sırasında ağ adaptörleriyle ilgili bir uyarı görebilirsiniz, bu uyarıyı kabul edin.</li>
            <li>Kurulum tamamlandıktan sonra "Finish" butonuna basarak VirtualBox'ı başlatın.</li>
          </ul>
        </Section>

        <Section id="02" title="Oracle VM VirtualBox İçerisinde Windows 11 Nasıl, Nereden İndirilir ve Kurulur?">
          <p className="mt-2">İndirme Adresi: <a href="https://www.microsoft.com/en-us/software-download/windows11" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.microsoft.com/en-us/software-download/windows11</a></p>
          <ul className="list-disc pl-5 mt-2">
            <li>"Windows 11 Disk Image (ISO)" seçeneğini seçin, dilinizi belirleyin ve indirme işlemini başlatın.</li>
            <li>VirtualBox'ı açın ve "New" (Yeni) butonuna tıklayın.</li>
            <li>İsim olarak "Windows 11" yazın ve işletim sistemi türü olarak "Microsoft Windows," sürüm olarak da "Windows 10 (64-bit)" seçin.</li>
            <li>"Next" butonuna tıklayın ve RAM miktarını belirleyin. En az 4 GB (4096 MB) RAM önerilir.</li>
            <li>"Create a virtual hard disk now" seçeneğini seçin ve "Next" butonuna tıklayın.</li>
            <li>"VDI (VirtualBox Disk Image)" seçeneğini ve "Dynamically allocated" seçeneğini seçin. Disk boyutunu en az 64 GB olarak ayarlayın.</li>
            <li>Oluşturduktan sonra, sanal makineyi seçip "Settings" (Ayarlar) kısmına gidin.</li>
            <li>"Storage" bölümünde, "Empty" olan CD simgesine tıklayın ve sağ tarafta "Choose a disk file" seçeneğine basarak indirdiğiniz Windows 11 ISO dosyasını seçin.</li>
            <li>Ayarları kaydedin ve sanal makineyi başlatın. Windows 11 kurulum sihirbazı açılacak, buradan normal bir Windows kurulumu yapar gibi işlemleri takip edin.</li>
          </ul>
        </Section>

      <Section id="03" title="Oracle VM VirtualBox Ayarları Nasıl Yapılır? CPU ve RAM Artırma, Klasör Paylaşımı Nasıl Yapılır?">
    <h3 className="font-bold mt-2">CPU ve RAM Artırma:</h3>
    <ul className="list-disc pl-5 mt-2">
        <li>VirtualBox'ı açın ve Windows 11 sanal makinenizi seçin.</li>
        <li>"Settings" (Ayarlar) butonuna tıklayın.</li>
        <li>"System" bölümüne gidin ve "Processor" sekmesine geçin. Çekirdek sayısını artırarak CPU'yu yükseltebilirsiniz. (Genellikle 2 veya 4 çekirdek idealdir.)</li>
        <li>"Motherboard" sekmesinden RAM miktarını artırabilirsiniz. RAM'i artırırken, ana bilgisayarınızın toplam RAM'ini aşmamaya dikkat edin.</li>
    </ul>
    <h3 className="font-bold mt-4">Klasör Paylaşımı:</h3>
    <ul className="list-disc pl-5 mt-2">
        <li>Sanal makineniz kapalıyken "Settings" - "Shared Folders" bölümüne gidin.</li>
        <li>Sağ tarafta "+" simgesine tıklayın ve "Folder Path" kısmında paylaşılan klasörünüzü seçin.</li>
        <li>"Auto-mount" ve "Make Permanent" kutularını işaretleyin.</li>
        <li>Sanal makinenizi başlatın ve Windows 11'in içinden "This PC" (Bu Bilgisayar) bölümünde paylaşılan klasörü görebilirsiniz.</li>
    </ul>
</Section>

<Section id="04" title="VirtualBox İçine ve Kendi Bilgisayarınıza Adobe Premiere Pro ve Creative Cloud Nasıl Kurulur?">
    <p className="mt-2">Creative Cloud İndirme Adresi: <a href="https://www.adobe.com/creativecloud/desktop-app.html" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.adobe.com/creativecloud/desktop-app.html</a></p>
    <ul className="list-disc pl-5 mt-2">
        <li>Adobe hesabınızla giriş yapın. (Kullanıcı adı ve şifreyi ben vereceğim.) ve "Download" butonuna tıklayarak Creative Cloud uygulamasını indirin.</li>
        <li>İndirilen Creative Cloud uygulamasını kurun ve başlatın.</li>
        <li>Uygulama içinden "Premiere Pro"yu bulun ve "Install" butonuna tıklayarak kurulum işlemini tamamlayın.</li>
    </ul>
</Section>

<Section id="05" title="Oracle VM VirtualBox'daki Premiere İçerisine Autocut Eklentisi Nasıl İndirilir?">
    <p className="mt-2">Autocut Eklentisi İndirme Adresi: <a href="https://www.autocut.com/en/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.autocut.com/en/</a></p>
    <ul className="list-disc pl-5 mt-2">
        <li>Autocut indirin, ama henüz kurulumu başlatmayın.</li>
    </ul>
</Section>

<Section id="06" title="İşletim Sisteminin Yedeğini Alma">
    <ul className="list-disc pl-5 mt-2">
        <li>Sanal makineyi kapatın. VirtualBox ana ekranında sanal makinenizi seçin, sağ tıklayın ve "Clone" (Klonla) seçeneğine tıklayın.</li>
        <li>"Full Clone" seçeneğini seçin ve bir isim vererek klonlama işlemini başlatın.</li>
        <li>Bu klon, Autocut eklentisinin her 15 günlük süre bitiminde tekrar yedekten başlamanızı sağlayacak.</li>
    </ul>
</Section>

<Section id="07" title="Autocut Eklentisinin Kurulumu">
    <ul className="list-disc pl-5 mt-2">
        <li>İndirilen eklentiyi çalıştırarak Premiere Pro'ya kurun.</li>
        <li>Premiere Pro'yu başlatın ve yeni bir proje oluşturun ya da mevcut bir projeyi açın.</li>
        <li>Üst menüde "Window" (Pencere) sekmesine tıklayın ve ardından "Extensions" (Eklentiler) kısmına gidin.</li>
        <li>Burada "Autocut" seçeneğini göreceksiniz. Bu seçeneğe tıklayarak Autocut eklentisini başlatın. Eklenti, Premiere Pro'nun sağ panelinde açılacaktır.</li>
        <li>Autocut paneli açıldığında, genellikle "Activate Trial" veya "Start Free Trial" şeklinde bir buton göreceksiniz.</li>
        <li>Butona tıklayın ve açılan sayfada e-posta adresinizi girerek 15 günlük deneme süresini başlatın.</li>
        <li>Eğer daha önce kullandığınız bir e-posta adresiyle giriş yaptıysanız, yeni bir e-posta adresiyle tekrar deneme süresini başlatmanız gerekecek. (Yeni bir e-posta için: <a href="https://temp-mail.org/en/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://temp-mail.org/en/</a>)</li>
        <li>Autocut eklentisi etkinleştirildiğinde, paneldeki seçenekler kullanıma açılacak.</li>
        <li>Videonuzu Premiere Pro’ya ekleyin ve Autocut panelinden "Analyze" veya "Start Cutting" gibi seçeneklerle videonun sessiz kısımlarını analiz ederek otomatik olarak kesmesini sağlayabilirsiniz.</li>
    </ul>
</Section>

<Section id="08" title="VirtualBox ve Kendi Bilgisayarınız Arasında Hazırlanan Videoları Nasıl Aktarır ve Kendi Bilgisayarınızda Düzenlemeye Devam Edersiniz?">
    <ul className="list-disc pl-5 mt-2">
        <li>VirtualBox’ı açın ve Windows 11 sanal makinenizi seçin, ardından "Settings" (Ayarlar) - "Shared Folders" kısmına gidin.</li>
        <li>"+" butonuna tıklayın ve "Folder Path" kısmında kendi bilgisayarınızdaki bir klasörü seçin (örneğin, C:\Paylasim).</li>
        <li>"Auto-mount" ve "Make Permanent" seçeneklerini işaretleyin.</li>
        <li>Sanal makineyi başlatın ve "This PC" (Bu Bilgisayar) bölümünde paylaşılan klasörü göreceksiniz.</li>
        <li>VirtualBox içindeki Premiere Pro’da Autocut ile videonun sessiz kısımlarını düzenledikten sonra videoyu paylaşılan klasöre kaydedin.</li>
        <li>Kendi bilgisayarınızdaki Premiere Pro'yu açın ve paylaşılan klasörden videoyu alarak düzenlemeye devam edin.</li>
    </ul>
</Section>

<Section id="09" title="15 Günlük Deneme Süresi Bittiğinde Yedeklemenin Tekrar Kurulumu ve Süreci Yenileme">
    <ul className="list-disc pl-5 mt-2">
        <li>15 günlük Autocut deneme süresi bittiğinde, VirtualBox ana ekranında mevcut sanal makineyi silin.</li>
        <li>Ardından daha önce aldığınız yedeği seçip yeniden "Clone" yaparak yeni bir yedek oluşturun.</li>
        <li>Bu işlem, Premiere Pro ve Autocut kurulmuş halde size yeniden 15 günlük bir deneme süresi tanıyacak.</li>
        <li>Kurulduktan sonra da yedekleme işlemini deneyebiliriz. İşe yararsa kurulum hazır olmuş olacak.</li>
    </ul>
</Section>

        </div>
       
      
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Video Yönetimi (Yapım Aşamasında)</h2>
        <form onSubmit={handleUpload} className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/*"
              className="flex-grow p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <Upload className="mr-2" size={18} />
              Yükle
            </button>
          </div>
        </form>

        <h3 className="text-xl font-semibold mb-3">Video Listesi</h3>
        {Array.isArray(videos) && videos.length > 0 ? (
          <ul className="space-y-2">
            {videos.map((video) => (
              <li key={video.id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                <span>{video.filename}</span>
                <div className="space-x-2">
                  <a
                    href={`/api/production/${video.id}/download`}
                    download
                    className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                  >
                    <Download className="mr-1" size={18} />
                    İndir
                  </a>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-500 hover:text-red-700 inline-flex items-center"
                  >
                    <Trash2 className="mr-1" size={18} />
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Henüz video yok.</p>
        )}
      </div>

      
      
      </div>
  );
};

export default ProductionComponent;