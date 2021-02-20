import React from 'react';
import {
    Button,
    Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./Core.module.css";

export const Home: React.FC = () =>{
        return (
            <div className={styles.all}>
                <h1 className={styles.home}>Home</h1>
                <p className={styles.button}>
                <Link to="/media" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="secondary">
                            Media
                        </Button>
                </Link>
                </p>
                
            </div>
        );
}