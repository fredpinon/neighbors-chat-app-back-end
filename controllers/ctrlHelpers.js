exports.createUserInitials = (fname, lname) => {
  const initials = fname.substring(0,1) + lname.substring(0,1)
  return initials.toUpperCase();
}
