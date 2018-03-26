import styles from './messagePanel.less';
import {Icon} from 'antd';

export default class MessagePanel extends React.Component{
    render(){
        const {textNum,description,icontype,textcolor} = this.props;
        return(
        <div className={styles.panel}>
            <div className={styles['panel-body']}>
                <p className={styles.icon}>
                    <Icon className={styles.icon} type={icontype} style={{color:textcolor}} />
                </p>
                <h4 className={styles.value} >
                    <span style={{color:textcolor}} >{textNum}</span>
                    {/*<span>$</span>*/}
                </h4>
                <p className={styles.description}>
                    {description}
                </p>
            </div>
        </div>
    )}
}