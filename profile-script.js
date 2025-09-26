document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const staffId = params.get('id');

    const profilePhoto = document.getElementById('profile-photo');
    const profileName = document.getElementById('profile-name');
    const profileFaculty = document.getElementById('profile-faculty');
    const profileProdi = document.getElementById('profile-prodi');
    const profileInstagram = document.getElementById('profile-instagram');

    if (staffId && staffData[staffId]) {
        const staff = staffData[staffId];
        document.title = `${staff.name} - Profil Staff`;
        profilePhoto.src = staff.photo;
        profilePhoto.alt = `Foto ${staff.name}`;
        profileName.textContent = staff.name;
        profileFaculty.textContent = staff.faculty;
        profileProdi.textContent = staff.prodi;
        profileInstagram.textContent = staff.instagram.split('/').filter(Boolean).pop(); // Ambil username
        profileInstagram.href = staff.instagram;
    } else {
        // Jika ID tidak valid, tampilkan pesan error
        document.title = 'Staff Tidak Ditemukan';
        profileName.textContent = 'Staff Tidak Ditemukan';
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.innerHTML = `<h2 style="color:var(--color-accent);">Staff tidak ditemukan. Silakan kembali ke halaman utama.</h2>
                                     <a href="index.html#staff-section" class="cta-button" style="width: auto; margin-top: 20px;">Kembali</a>`;
        }
    }
});