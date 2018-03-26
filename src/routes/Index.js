import React from 'react';
import {Link} from 'dva/router';
import { connect } from 'dva';
import { Menu, Icon, Switch, Layout,Breadcrumb} from 'antd'
import Top from '../components/header'
import Bottom from '../components/bottom'
import styles from './Index.less'
import { routerRedux } from 'dva/router';

const SubMenu = Menu.SubMenu;
const { Sider,Content } = Layout;
const MemberId = sessionStorage.getItem('MemberId');
 class Container extends React.Component {
  state = {
    theme: 'dark',
    current: 'index',
    collapsed: false,
    mode: 'inline',  // 水平垂直展现
    openKeys:[]
  };
  componentDidMount() {
    this.props.dispatch({type:'common/getMenus'});
    this.props.dispatch({type:'login/Getuserinfo',MemberId});
    this.handleClick([], 'index')
  }
  changeTheme = (value) => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: this.state.collapsed ? 'inline' : 'vertical',
    });
  };
  clear = () => {
    this.setState({
      current: 'index',
    });
  };
  handleClick = (e, special) => {
    let {navs}=this.props;
    if(e.key){
      if(navs.length>=2){
        navs.pop();
      }
      navs.push(e.key);
      sessionStorage.setItem('navs',navs);
      this.props.dispatch({type:'login/updateNavs',navs});
    }
    this.setState({
      current: e.key || special,
    });
  };
  onOpenChange = (openKeys) => {
    let key=openKeys[openKeys.length-1];
    let navs=[];
    navs.push(key);
    sessionStorage.setItem('navs',navs);
    this.props.dispatch({type:'login/updateNavs',navs});
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  };
  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }
  toHome=()=>{
    let navs=[];
    this.onOpenChange([]);
    this.props.dispatch({type:'login/updateNavs',navs});
    this.props.dispatch(routerRedux.push('/home'))
  }
   modalClick=()=>{
     let url="";
     this.props.dispatch({type:'login/ImgModalHide'});
     this.props.dispatch({type:'login/ImgUrl',url});
   }
  render() {
    const {menus,navs,ImgModalHide,ImgUrl}=this.props;
    let tabs=sessionStorage.getItem('navs');
    let TabNavs=[];
    if(tabs&&tabs.length>0){
      TabNavs=tabs.split(',');
    }
    if(TabNavs[1]=='认证信息'){
      TabNavs.splice(0,1)
    }
    const extraBreadcrumbItems=TabNavs.map(item=>(
        <Breadcrumb.Item key={item}  className={styles.breadcrumb}>
            {item}
        </Breadcrumb.Item>
      ))
    const breadcrumbItems = [(
    <Breadcrumb.Item key="home" className={styles.breadcrumb}>
      <span onClick={this.toHome}><Icon type="home" /> 主页</span>
    </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems)
    return (
      <Layout className={styles.containAll}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}

        >

          <Menu
            theme={this.state.theme}
            onClick={this.handleClick}
            defaultOpenKeys={['sysadmin']}
            selectedKeys={[this.state.current]}
            className={styles.menu}
            mode={this.state.mode}
            onOpenChange={this.onOpenChange}
            openKeys={this.state.openKeys}
          >
            { this.state.theme === 'light' ? <div className={styles.github}></div> : <div className={styles.github}></div> }
            {
              menus.map((subMenu) => {
                if (subMenu.children && subMenu.children.length) {
                  return (
                    <SubMenu key={subMenu.Name} title={<span><Icon type={subMenu.IconCss} /><span>{subMenu.Name}</span></span>}>
                      {subMenu.children.map(menu => (
                        <Menu.Item key={menu.Name}><Link to={`/${menu.Url}/${menu.MenuId}`}>{menu.Name}</Link></Menu.Item>
                      ))}
                    </SubMenu>
                  )
                }
                return (
                  <Menu.Item key={subMenu.Name}>
                    <Link to={`/${subMenu.Url}`}>
                      <Icon type={subMenu.IconCss}/><span className={styles['nav-text']}>{subMenu.Name}</span>
                    </Link>
                  </Menu.Item>
                )
              })
            }
          </Menu>
          <div className={styles.text}>
                <div>
                    <span className={styles.me}>好伙伴软件 · </span>
                    <span className={styles.me}>专注物流软件开发</span>
                    <p className={styles.me}>2017版  | v1.0</p>
                </div>
            </div>
        </Sider>
        <Layout>
          <Top toggle={this.toggle} collapsed={this.state.collapsed} clear={this.clear} />
          <Content className={styles.content}>
              <Breadcrumb separator=">" style={{height:'50px',lineHeight:'50px',fontSize:'14px',borderBottom:'1px solid #ddd',marginBottom:'10px',marginTop:'-20px'}}>
                  {breadcrumbItems}
              </Breadcrumb>
              {this.props.children}
          </Content>
          <Bottom />
        </Layout>
        <div onClick={this.modalClick} style={ImgModalHide?{width:'0px',height:'0px'}:{width:'100%',height:'100%'}} className={styles.CheckImg}>
          <div className={styles.CheckImgShadow}>
            <div className={styles.CloseImg}>X</div>
            <img className={styles.CheckImgStyle} src={ImgUrl}/>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {...state.login,...state.common};
}

export default connect(mapStateToProps)(Container);
