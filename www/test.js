var a = "http://doonts.lxc/role/view/144/project-manager-with-spaces#130".match(/#(\d+)$/);
console.log(a.length);
if (a && a[1]) {
    console.log(a[1]);
}