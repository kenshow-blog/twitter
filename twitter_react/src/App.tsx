import React from 'react';
import styles from "./App.module.css";

import Core from "./features/core/Core";

import { StylesProvider } from '@material-ui/core';

function App() {
  return <div className={styles.app}>
    <Core />
    </div>
}

export default App;
