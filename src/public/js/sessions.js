//LOGIN
const loginUser = () => {
    let email = document.getElementById('email').value;
    let password  = document.getElementById('password').value;

    if(email.trim() == '' || password.trim() == ''){
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Faltan completar campos',
            showConfirmButton: false,
            timer: 2000
        })
    }
}

