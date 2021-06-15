let app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Reservasi',
  // App id
  id: 'com.cafe.reservasi',
  statusbar: {
    androidBackgroundColor: '#fa702a',
    androidTextColor: 'white'
  },
  // Enable swipe panel
  panel: {
    swipe: 'left'
  },
  view: {
    stackPages: true
  },
  // Add default routes
  routes: [{
    path: '/login/',
    componentUrl: './pages/login.html',
  }, {
    path: '/loginPhone/',
    componentUrl: './pages/loginPhone.html',
  }, {
    path: '/registrasi/',
    componentUrl: './pages/registrasi.html',
  }, {
    path: '/customer/',
    componentUrl: './pages/customer.html',
  }, {
    path: '/pesanan/',
    componentUrl: './pages/pesanan.html',
    options: {
      transition: 'f7-parallax',
    }
  }, {
    path: '/transaksi/',
    componentUrl: './pages/transaksi.html',
    options: {
      transition: 'f7-parallax',
    }
  }, {
    name: 'reservasi',
    path: '/reservasi/:tanggal/:jam/:durasi/',
    componentUrl: './pages/reservasi.html',
  }, {
    name: 'pembayaran',
    path: '/pembayaran/:id/',
    componentUrl: './pages/pembayaran.html',
  }, {
    path: '/profil/',
    componentUrl: './pages/profil.html',
  }],
});

let mainView = app.views.create('.view-main');

let $$ = Dom7;

// const URL = 'http://192.168.43.78/reservasi-server/api/';
const URL = 'http://reservasi-rsc.000webhostapp.com/api/';

if (navigator.connection.type == 'none') {
  app.dialog.alert('Anda tidak memiliki koneksi internet', 'Informasi');
}

Template7.registerHelper('daftarMejaHelper', (meja) => {
  let res = [];
  for (let items of meja) {
    const item = JSON.parse(items);
    res.push(`<li class="item-content">
                <div class="item-inner">
                    <div class="item-title">Meja ${item.number}</div>
                    <div class="item-after text-color-black"><b>${formatRupiah(item.harga)}</b>&nbsp;
                    <a href="#" class="color-deeporange" @click="hapusOrderMeja(${item.number},${item.harga})"><i class="icons f7-icons" style="font-size:20px;">xmark_octagon_fill</i></a>
                    </div>
                </div>
            </li>`);
  }

  return res.join('');
});

Template7.registerHelper('daftarMejaFormatter', (daftarMeja) => {
  const data = JSON.parse(daftarMeja);

  return data.join(', ');
})

Template7.registerHelper('durasiFormatter', (num) => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours} jam ${minutes > 0 ? minutes + ` menit` : ''}`
})

Template7.registerHelper('waktuFormatter', (waktu) => {
  moment.locale('id');
  return moment(waktu).fromNow();
})

Template7.registerHelper('formatRupiahHelper', (angka) => {
  return formatRupiah(String(angka));
})

function formatRupiah(angka) {
  let number_string = angka != null ? angka.replace(/[^,\d]/g, '').toString() : '',
    split = number_string.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return 'Rp ' + (rupiah ? rupiah : '');
}

function cekLogin(isSignedIn) {
  if (isSignedIn) {
    // mainView.router.navigate('/registrasi/');
    mainView.router.navigate('/customer/', {
      reloadAll: true
    });
  } else {
    mainView.router.navigate('/login/');
  }
}

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);

// cekLogin(true);

function onDeviceReady() {
  FirebasePlugin.isUserSignedIn(cekLogin);
}

let opened = 0;

function exitApp() {
  if (opened > 0) {
    return false;
  } else {
    app.dialog.confirm('Anda yakin untuk menutup aplikasi?', 'Informasi',
      function () {
        navigator.app.exitApp();
      },
      function () {
        opened = 0;
        return false;
      }
    );
    opened = 1;
  }
}

function onBackKeyDown() {
  // Handle the back button
  if ($$('.modal-in').length > 0) {
    app.sheet.close('.modal-in')
  } else if (app.views.main.history.length == 1) {
    exitApp();
    e.preventDefault();
  } else if (app.views.main.history.length == 3) {
    app.view.main.router.back('/customer/', {
      force: true
    });
  } else {
    app.dialog.close();
    app.views.main.router.back();
    return false;
  }
}