const PROVIDER_OP = "https://opt-mainnet.g.alchemy.com/v2/MnmlgcGeD8FPWiy_0SHlubv1htTHIB1g";
const API_OP_CONTRACT = 'https://api-optimistic.etherscan.io/api?module=contract&action=getabi&apikey=A7YUEGDPZD2DD2G784BNDKK1WZBBQP7D4X&address=';
const CONTRACT_ADDR = "0x80fe12c1076d2b708D6495186690f6D275740D44";
const IMG_HOST = "https://diewland.github.io/my-missing-jigsaw-assets";
const IMG_UNREVEAL = `${IMG_HOST}/0_unreveal.png`;

let web3 = new Web3(PROVIDER_OP);
let url = API_OP_CONTRACT + CONTRACT_ADDR;
let mmsjs = null;

// init contract obj
freeze();
$.getJSON(url, data => {
  let contractABI = JSON.parse(data.result);
  if (contractABI) {
    mmsjs = new web3.eth.Contract(contractABI);
    mmsjs.options.address = CONTRACT_ADDR;
    console.log('contract', mmsjs);
    unfreeze();
  }
  else {
    alert('contractABI not found');
  }
});

function freeze() {
  $('#wallet_addr').val('.....');
  $('.img-thumbnail').attr('src', IMG_UNREVEAL);
  $('#btn-resolve').attr('disabled', true);
  $('#btn-resolve').removeClass('btn-info');
  $('#btn-resolve').addClass('btn-warning');
}
function unfreeze() {
  $('#wallet_addr').val('');
  $('#btn-resolve').attr('disabled', false);
  $('#btn-resolve').removeClass('btn-warning');
  $('#btn-resolve').addClass('btn-info');
  //$('#jigsaw_id').focus();
}

// resolve logic
let CODES = ['A626', 'A539', 'A54A', 'A22A', 'A323', 'A653', 'A121', 'A657', 'A129', 'B630', 'A146', 'A646', 'A53A', 'A529', 'A313', 'A713', 'A512', 'A523', 'A414', 'A132', 'A114', 'A232', 'B210', 'A151', 'A349', 'A732', 'A73A', 'A454', 'A651', 'B340', 'A415', 'A425', 'A344', 'A126', 'A658', 'A254', 'A112', 'A136', 'A639', 'A642', 'A144', 'A154', 'A742', 'B240', 'A737', 'A336', 'A451', 'A759', 'A446', 'A638', 'A115', 'A158', 'A351', 'A724', 'A226', 'B310', 'A23A', 'A329', 'B550', 'A259', 'A749', 'A458', 'A123', 'A735', 'A542', 'C100', 'B120', 'A718', 'A426', 'A521', 'A131', 'A628', 'A721', 'A345', 'A659', 'B110', 'A636', 'A439', 'B410', 'A751', 'A229', 'A448', 'A155', 'A221', 'A256', 'A217', 'A258', 'A128', 'A25A', 'A411', 'B710', 'A522', 'A533', 'A117', 'A551', 'A617', 'A339', 'A246', 'A731', 'A52A'];
function resolve_img_url(jid) {
  let c = CODES[jid];
  return `${IMG_HOST}/${c}.png`;
}
function load_img(url) {
  let $thumb = $('.img-thumbnail');
  let img = new Image();
  img.onload = _ => {
    $thumb[0].src = img.src;
    //$thumb.css('opacity', '1');
  }
  img.src = url;
  //$thumb.css('opacity', '0.5');
}
function resolve_img(jid) {
  let url = resolve_img_url(jid);
  load_img(url);
}
function resolve_wallet_addr(jid) {
  mmsjs.methods.ownerOf(jid).call().then(addr => {
    unfreeze();
    $('#wallet_addr').val(addr);
  }).catch(msg => {
    alert(msg);
  });
}

// resolve button
let latest_jid = null;
$('#btn-resolve').click(_ => {
  let jid = +$('#jigsaw_id').val();

  // prevent bomb
  if (jid == latest_jid) return;
  latest_jid = jid;

  freeze();
  resolve_img(jid);
  resolve_wallet_addr(jid);
});

// bind enter
$('#jigsaw_id').on('keypress', e => {
  if (e.which != 13) return;
  $('#btn-resolve').click();
});

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}
$('#btn-clipboard').click(_ => {
  let addr = $('#wallet_addr').val();
  copyToClipboard(addr);
  alert('Copied');
});
