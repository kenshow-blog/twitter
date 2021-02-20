import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from "axios";
import { LOGIN, REGISTER } from "../types";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    async (authen: LOGIN) =>{
        const res = await axios.post(`${apiUrl}login/`, authen, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: REGISTER) => {
        const res = await axios.post(`${apiUrl}api/register/`, auth, {

            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
    "profile/get",
    async () => {
        const res = await axios.get(`${apiUrl}api/mypage/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        openSignIn: true,
        openSignUp: false,
        isLoadingAuth: false,
        myprofile: {
            id: "",
            username: "",
            email: "",
        }
    },
    reducers: {
        fetchCredStart(state) {
            state.isLoadingAuth = true;
        },
        fetchCredEnd(state) {
            state.isLoadingAuth = false;
        },
        setOpenSignIn(state) {
            state.openSignIn = true;
        },
        resetOpenSignIn(state) {
            state.openSignIn = false;
        },
        setOpenSignUp(state) {
            state.openSignUp = true;
        },
        resetOpenSignUp(state) {
            state.openSignUp = false;
        },
        editUsername(state, action) {
            state.myprofile.username = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            localStorage.setItem('localJWT', action.payload.token);
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
            state.myprofile = action.payload;
        });
        
    }
});

export const {
    fetchCredStart,
    fetchCredEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    editUsername
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>  
    state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectProfile = (state: RootState) => state.auth.myprofile;

export default authSlice.reducer;
