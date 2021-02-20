import React, { useEffect } from 'react'
import { PROPS_POST_IMAGE } from "../types";
import { RouteComponentProps, Link } from 'react-router-dom';
import * as H from "history";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Media.module.css";
import { Grid, Button } from "@material-ui/core";

import { 
    fetchAsyncGetImages,
    fetcyAsyncDeleteImages,
    selectImages,
     } from "./mediaSlice";
import {setOpenSignIn} from "../auth/authSlice";

interface Props extends RouteComponentProps<{}> {
    location: H.Location<PROPS_POST_IMAGE>
}


export const MediaDetail: React.FC<Props> = props => {
    let postImage = props.location.state;
    const dispatch: AppDispatch = useDispatch();
    const images = useSelector(selectImages);


    const imagesOnThisPage = images.filter((img) => {
        return img.imgPost === postImage.id
    })
    useEffect(() => {
        const fetchBootLoader = async () => {
            if(localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetImages());
                if (fetchAsyncGetImages.rejected.match(result)){
                    dispatch(setOpenSignIn());
                    return null;
                }
            }
        };
        fetchBootLoader();
    }, [dispatch]);

    return (
        <div className={styles.image_inner}>
            
            <p className={styles.button_detail}>
                <Link to="/" style={{ textDecoration: 'none', margin: '0 20px 0 20px' }}>
                        <Button className={styles.home_button} variant="contained" color="primary">
                            Home
                        </Button>
                </Link>

                <Link to="/media/" style={{ textDecoration: 'none', margin: '0 20px 0 20px' }}>
                        <Button className={styles.home_button} variant="contained" color="secondary">
                            Media
                        </Button>
                </Link>
                
            </p>
            <div style={{ padding: "5rem 0" }}>
            <h1 className={styles.imgTitle}>{postImage.scrName}'s photos</h1>
            <Grid container className={styles.to_images_grid} spacing={4}>
                {imagesOnThisPage
                .slice(0)
                .reverse()
                .map((image) =>(
                    <Grid key={image.id} item xs={12} md={4}>
                        <img src={image.imgs} alt="" className={styles.image} />
                        <Button color="secondary" variant="contained" style={{marginLeft:"10px"}}
                               onClick={async () => {
                                await dispatch(fetcyAsyncDeleteImages(image))}} >
                        del
                    </Button>
                    </Grid>
                ))}
            </Grid>
            </div> 
        </div>
    )
}


