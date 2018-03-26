import React from 'react';
import { connect } from 'dva';
import styles from './Editpas.css';

function Editpas() {
  return (
    <div className={styles.normal}>
      Route Component: Editpas
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Editpas);
