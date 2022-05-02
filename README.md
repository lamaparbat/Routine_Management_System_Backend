# Routine_Management_System_Backend
Routine Management System

## Backend API Guidelines

## Student endpoints

```perl
1. Login

http://localhost:8000/api/v4/student/Login

payload: {
   email:"",
   password:""
}

Response:
onSuccess: {
   message:"Login succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to login",
   token:null
}
