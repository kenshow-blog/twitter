import React, { useEffect, useState } from "react";
import styles from "./Media.module.css";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
    fetchPostImageStart,
    fetchPostImageEnd,
    selectIsLoadingPostImage,
    selectPostImage,
    fetchAsyncGetPostedImage,
    fetchAsyncPostImage,
    fetchAsyncPostImages,
    fetcyAsyncDeletePostedImage,
} from "./mediaSlice";
import {setOpenSignIn} from "../auth/authSlice";
import {
    Button,
    Grid,
    CircularProgress
} from "@material-ui/core";
import { DeleteDialog } from "./DeleteDialog";
import { PROPS_POST_IMAGE } from "../types";


export const Media: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const postedImage = useSelector(selectPostImage);
    const isLoadingAuth = useSelector(selectIsLoadingPostImage);
    const [text, setScrName] = useState("");
    const [commDlg, setCommDlg] = React.useState(false);
    const [usePostImage, setpostImage] = useState({
        id: 0,
        scrName: "",
        userPost: 0,
        created_on: "" 
    });

    const clickPostImage = (value: PROPS_POST_IMAGE) => {
        setpostImage(value)
    }
    useEffect(() => {
        const fetchBootLoader = async () => {
            if(localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetPostedImage());
                if (fetchAsyncGetPostedImage.rejected.match(result)){
                    dispatch(setOpenSignIn());
                    return null;
                }
            }
        };
        fetchBootLoader();
    }, [dispatch]);
    const postImage = async(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { scrName: text };
        await dispatch(fetchPostImageStart());
        await dispatch(fetchAsyncPostImage(packet));
        await dispatch(fetchAsyncPostImages(packet));
        await dispatch(fetchPostImageEnd());
        setScrName("");
    };
    

    return (
        <div>
            <h1 className={styles.media}>Media</h1>
            <br />
            <br />
            <h2 className={styles.title}>Collecting User's Posted Photos</h2>
            <form className={styles.postImageBox}>
                <input
                    className={styles.postImage_input}
                    type="text"
                    placeholder="Screen Name(later than 「@」)"
                    value={text}
                    onChange={(e) => setScrName(e.target.value)}
                    />
                <button
                disabled={!text.length}
                className={styles.postImage_button}
                type="submit"
                onClick={postImage}
                >
                    Collect
                </button>
                <div className={styles.auth_progress}>
                        {isLoadingAuth && <CircularProgress/>}
                </div>
            </form>

            
                <h2>Colletion</h2>
                <DeleteDialog
                    msg={"Are you sure you want to permanently delete this files ?"}
                    isOpen={commDlg}
                    doYes={async () => {
                        await dispatch(fetcyAsyncDeletePostedImage(usePostImage))
                        await setCommDlg(false)
                    }}
                    doNo={() => {setCommDlg(false)}}

                />
                <Grid container className={styles.to_detail_grid} spacing={4}>
                    {postedImage
                    .slice(0)
                    .reverse()
                    .map((pimage) =>(
                        <Grid key={pimage.id}  item xs={12} md={4}>
                            <Link to={{   
                                        pathname: `/media/detail/${pimage.id}`,
                                        state: {id: pimage.id,
                                            scrName: pimage.scrName,
                                            userPost: pimage.userPost,
                                            created_on: pimage.created_on}
                                        }}
                                        style={{ textDecoration: 'none' }}>
                                <Button className={styles.to_detail_button} variant="outlined" color="secondary">
                                    {pimage.scrName}
                                </Button>
                            </Link>
                            
                            
                            <Button color="secondary" variant="contained" style={{marginLeft:"10px"}}
                               onClick={ 
                                   () => {
                                    clickPostImage(pimage)
                                    setCommDlg(true)
                                       }} >
                                del
                            </Button>
                            
                        </Grid>
                    ))}
                </Grid>

            



            <p className={styles.button}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button className={styles.home_button} variant="contained" color="primary">
                            Home
                        </Button>
                </Link>
                </p>
            
        </div>
    )


};
