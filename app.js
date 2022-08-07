const PROVIDER_OP = "https://opt-mainnet.g.alchemy.com/v2/MnmlgcGeD8FPWiy_0SHlubv1htTHIB1g";
const API_OP_CONTRACT = 'https://api-optimistic.etherscan.io/api?module=contract&action=getabi&apikey=A7YUEGDPZD2DD2G784BNDKK1WZBBQP7D4X&address=';
const CONTRACT_ADDR = "0x76c9fb6ae4151e00bbdbf9B771CF84DE42a31636";
const IMG_UNREVEAL = "https://quixotic.io/_next/image?url=https%3A%2F%2Ffanbase-1.s3.amazonaws.com%2Fquixotic-collection-profile%2Fprofile_MuHtSRm.gif&w=3840&q=75";

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
  $('#jigsaw_id').focus();
}

// resolve logic
function resolve_img_url(jid) {
  return `https://ipfs.io/ipfs/bafybeigdvfikmbvkvtfamfnpc7i4ytshmtjjvomnqavdgrrkzjafx6witm/${jid}.png`;
}
function resolve_img(jid) {
  let url = resolve_img_url(jid);
  $('.img-thumbnail').attr('src', url);
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
