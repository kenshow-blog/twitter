import React, { useEffect } from 'react'
import { Auth } from "../auth/Auth";
import { Media } from "../media/Media";
import { MediaDetail } from "../media/MediaDetail";
import { Home } from "./Home";

import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import {
    Button,
    CircularProgress
} from "@material-ui/core";
import {
    selectIsLoadingAuth,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchAsyncGetMyProf,
    selectProfile,
    editUsername,
} from "../auth/authSlice";


const Core: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);

    useEffect(() => {
        const fetchBootLoader = async () => {
            if(localStorage.localJWT) {
                dispatch(resetOpenSignIn());
                const result = await dispatch(fetchAsyncGetMyProf());

                if (fetchAsyncGetMyProf.rejected.match(result)) {
                    dispatch(setOpenSignIn());
                    return null;
                }
                
            }
        };
        fetchBootLoader();
    }, [dispatch]);

    return (
        <div>
            <Auth />

            <div className={styles.core_header}>
                <h1 className={styles.core_title}>Twitter-app</h1>
                {profile?.username ? <>
                <h2 className={styles.core_titleModal}>
                    {profile.username}'s room
                </h2>
                <div className={styles.core_logout}>
                    {(isLoadingAuth) && <CircularProgress/>}
                    <Button
                    onClick={() => {
                        localStorage.removeItem("localJWT");
                        dispatch(editUsername(""));
                        dispatch(setOpenSignIn());
                    }}
                    >

                        Logout
                    </Button>
                </div>
                </> : <div>
                    <Button
                    onClick={() => {
                        dispatch(setOpenSignIn());
                        dispatch(resetOpenSignUp());
                    }}>
                        Login
                    </Button>

                    <Button
                    onClick={() => {
                        dispatch(setOpenSignUp());
                        dispatch(resetOpenSignIn());
                    }}>
                        SignUp
                    </Button>

                    </div>}
            </div>



            {/* body */}
            
            <main className={styles.container}>
                <div className={styles.inner_container}>
                {profile?.username ? <>
                    <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/media" component={Media} />
                        <Route path="/media/detail/:id" component={MediaDetail} />

                     </Switch>
                    </BrowserRouter>

                </> : 
                <>
                </>}
                </div>
            </main>
            <div className={styles.all}></div>
            
            <footer></footer>
        </div>
    )
}

export default Core
