function toggleSidebar(){document.querySelector('.sidebar')?.classList.toggle('hide');}
function logout(){alert('ออกจากระบบ');}
document.querySelectorAll('input').forEach(input=>input.addEventListener('focus',()=>input.select()));
