(function(){
  var form = document.getElementById('regForm');
  var successBanner = document.getElementById('successBanner');
  var locMetro = document.getElementById('locMetro');
  var locProvince = document.getElementById('locProvince');
  var cardMetro = document.getElementById('cardMetro');
  var cardProvince = document.getElementById('cardProvince');
  var provinceField = document.getElementById('provinceField');

  function setFieldState(name, valid){
    var el = document.querySelector('[data-field="'+name+'"]');
    if(!el) return;
    el.classList.remove('invalid','valid');
    if(valid === true) el.classList.add('valid');
    if(valid === false) el.classList.add('invalid');
  }

  function toggleProvinceField(){
    var showProvince = locProvince.checked;
    provinceField.style.display = showProvince ? 'block' : 'none';
    cardMetro.classList.toggle('checked', locMetro.checked);
    cardProvince.classList.toggle('checked', locProvince.checked);
    if(!showProvince){ setFieldState('provinceName', null); }
  }
  locMetro.addEventListener('change', toggleProvinceField);
  locProvince.addEventListener('change', toggleProvinceField);

  function val(id){ return document.getElementById(id).value.trim(); }

  var validators = {
    crn: function(){ return /^\d{10,12}$/.test(val('crn')); },
    email: function(){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')); },
    confirmEmail: function(){ return val('confirmEmail') !== '' && val('confirmEmail') === val('email'); },
    userId: function(){ return /^[A-Za-z][A-Za-z0-9_]{7,19}$/.test(val('userId')); },
    confirmUserId: function(){ return val('confirmUserId') !== '' && val('confirmUserId') === val('userId'); },
    surname: function(){ return val('surname') !== ''; },
    givenName: function(){ return val('givenName') !== ''; },
    dob: function(){
      var d = val('dob');
      if(!d) return false;
      var dob = new Date(d);
      var age = (new Date() - dob) / (1000*60*60*24*365.25);
      return age >= 15 && age <= 100;
    },
    location: function(){ return locMetro.checked || locProvince.checked; },
    provinceName: function(){ return !locProvince.checked || val('provinceName') !== ''; }
  };

  function validateField(name){
    var ok = validators[name]();
    setFieldState(name, ok);
    return ok;
  }

  ['crn','email','confirmEmail','userId','confirmUserId','surname','givenName','dob'].forEach(function(id){
    document.getElementById(id).addEventListener('blur', function(){ validateField(id); });
    document.getElementById(id).addEventListener('input', function(){
      if(document.querySelector('[data-field="'+id+'"]').classList.contains('invalid')) validateField(id);
    });
  });
  document.getElementById('provinceName').addEventListener('blur', function(){ validateField('provinceName'); });
  document.getElementById('provinceName').addEventListener('input', function(){
    if(provinceField.classList.contains('invalid')) validateField('provinceName');
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var names = ['crn','email','confirmEmail','userId','confirmUserId','surname','givenName','dob','location'];
    if(locProvince.checked) names.push('provinceName');

    var allValid = true;
    var firstInvalid = null;
    names.forEach(function(name){
      var ok = validateField(name);
      if(!ok){
        allValid = false;
        if(!firstInvalid) firstInvalid = name;
      }
    });

    if(!allValid){
      successBanner.classList.remove('show');
      var target = document.querySelector('[data-field="'+firstInvalid+'"]');
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'center'});
        var input = target.querySelector('input, select');
        if(input) input.focus();
      }
      return;
    }

    successBanner.classList.add('show');
    successBanner.scrollIntoView({behavior:'smooth', block:'start'});
  });

  document.getElementById('clearBtn').addEventListener('click', function(){
    form.reset();
    document.querySelectorAll('.field').forEach(function(f){ f.classList.remove('invalid','valid'); });
    provinceField.style.display = 'none';
    cardMetro.classList.remove('checked');
    cardProvince.classList.remove('checked');
    successBanner.classList.remove('show');
  });
})();
