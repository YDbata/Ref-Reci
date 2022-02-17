// React, Router
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

// Style
import { makeStyles } from '@material-ui/core/styles';

// Core
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

// Server
import axios from 'axios';
import server from '../../../server.json';


const useStyles = makeStyles((theme) => ({
	root: {
			height: '100vh',
	},
	image: {
		backgroundImage: "url(" + process.env.PUBLIC_URL + '/images/main.png' + ")",
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			justifyContent: 'center'
		},
		[theme.breakpoints.up('md')]: {
			justifyContent: 'flex-start'
		},
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalpaper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	mdbutton: {
		display: 'flex',
		justifyContent: 'center',
	}
}));


const postRegister = async (url, userName, userID, userPW) => {
	try {
		const data = await axios({
			method: 'post',
			url: url,
			data: {
					userName: userName,
					userID: userID,
					userPW: userPW
			},
			headers: {
					accept: 'application/json',
			},
		});
		return data.data;
	}
	catch (err) {
		console.log(`ERROR: ${err}`);
	}
}

const postSearchID = async (url, userID) => {
	try {
		const data = await axios({
			method: 'post',
			url: url,
			data: {
					userID: userID,
			},
			headers: {
					accept: 'application/json',
			},
		});
		return data.data;
	}
	catch (err) {
		console.log(`ERROR: ${err}`);
	}
}

const postEmailAuth = async (url, userID) => {
	try {
		const data = await axios({
			method: 'post',
			url: url,
			data: {
					userID: userID,
			},
			headers: {
					accept: 'application/json',
			},
		});
		return data.data;
	}
	catch (err) {
		console.log(`ERROR: ${err}`);
	}
}

const postLogin = async (url, userID, userPW) => {
	try {
		const data = await axios({
			method: 'post',
			url: url,
			data: {
					userID: userID,
					userPW: userPW
			},
			withCredentials: true,
			headers: {
					accept: 'application/json',
			},
		});
		return data.data;
	}
	catch (err) {
		console.log(url);
		console.log(`ERROR: ${err}`);
	}
}

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<span color="inherit">
				Ref:reci
			</span>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function SignUpSide({history}) {
	const classes = useStyles();

	//form 데이터
	const [userName, setUserName] = useState('');
	const [userID, setUserID] = useState('');
	const [verification, setVerification] = useState('');
	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	
	//아래 2개가 SIGN UP을 활성화 시키기 위한 조건
	const [emailAuth, setEmailAuth] = useState(false);
	const [passwordSame, setPasswordSame] = useState(false);
	
	//아이디와 인증버튼 활성화, 비활성화
	const [verButtonInactive, setVerButtonInactive] = useState(false);
	//인증번호 입력칸 활성화, 비활성화
	const [hiddenAuth, setHiddenAuth] = useState(true);
	//SIGN UP 버튼을 활성화, 비활성화
	const [signUpInactive, setSignUpInactive] = useState(true);

	//서버에서 받아온 인증번호
	const [emailAuthData, setEmailAuthData] = useState('');

	// HelperText & ErrorSign
	const [uNameHelperText, setUNameHelperText] = useState('');
	const [idHelperText, setIdHelperText] = useState('');
	const [verHelperText, setVerHelperText] = useState('');
	const [pwHelperText, setPwHelperText] = useState('');
	const [pwCheckHelperText, setPwCheckHelperText] = useState('');
	const [uNameError, setUNameError] = useState(false);
	const [idError, setIdError] = useState(false);
	const [verError, setVerError] = useState(false);
	const [pwError, setPwError] = useState(false);
	const [pwCheckError, setPwCheckError] = useState(false);

	// Modal 
	const [modalOpen, setModalOpen] = useState(false);
	const modalClose = () => {
		setModalOpen(false);
	};
	const [modalTitle, setModalTitle] = useState('');
	const [modalMessage, setModalMessage] = useState('');

	useEffect(()=>{
		if(password === passwordCheck && password !== ''){
			setPasswordSame(true);
		}
		else{
			setPasswordSame(false);
			if (password && passwordCheck) {
				setPwCheckHelperText('비밀번호가 일치하지 않습니다.');
				setPwCheckError(true);
			}
		}
	}, [password, passwordCheck])

	useEffect(() => {
		if (emailAuth && passwordSame) {
			setSignUpInactive(false);
		}
		else {
			setSignUpInactive(true);
		}
	}, [emailAuth, passwordSame])


	return (
			<Grid container component="main" className={classes.root}>
				<CssBaseline />
				<Grid item xs={false} sm={6} className={classes.image} />
				<Grid 
						item
						xs={12}
						sm={6}
						component={Paper}
						elevation={6}
						square
						container
						alignItems="center"
					>
						<div className={classes.paper}>
							<Typography color="primary" variant="h2" style={{fontFamily:'Munhwajae', fontStyle:'normal', fontWeight:'nomal'}} ><b>Ref:Reci</b></Typography>
							<br></br>
							<Typography component="h1" variant="h5" style={{fontWeight:'Bold'}}>회원가입</Typography>
							<form className={classes.form}>
								<Container maxWidth="md">
									<TextField
										name="userName"
										variant="outlined"
										margin="normal"
										required
										fullWidth
										autoComplete="fName"
										autoFocus
										id="userName"
										label="닉네임"
										helperText={uNameHelperText}
										error={uNameError}
										onChange={(event) => {
											setUserName(event.target.value);
											if (event.target.value.length < 2) {
												setUNameHelperText('닉네임은 2자 이상 20자 이하로 설정해주세요.');
												setUNameError(true);
											} else if (event.target.value.length > 20) {
												setUNameHelperText('닉네임은 2자 이상 20자 이하로 설정해주세요.');
												setUNameError(true);
												event.target.value = event.target.value.slice(0, -1);
											} else {
												setUNameHelperText('');
												setUNameError(false);
											}
										}}
									/>
									<Grid container spacing={2} alignItems="center">
											<Grid item xs={10}>
													<TextField
													disabled={verButtonInactive}
													variant="outlined"
													margin="normal"
													required
													fullWidth
													id="email"
													label="아이디(E-mail)"
													name="email"
													autoComplete="email"
													helperText={idHelperText}
													error={idError}
													onChange={(event) => {
															setUserID(event.target.value);
															setEmailAuth(false);
															setIdHelperText('');
															setIdError(false);
													}}
													/>
											</Grid>
											<Grid item xs={2}>
													<Button
													disabled={verButtonInactive}
													fullWidth
													color="primary"
													required
													size="large"
													onClick={async () => {
															const userDatas = await postSearchID(`${server.ip}/user/searchID`, userID);
															if (userDatas.value === 'Success') {
																	const emailDatas = await postEmailAuth(`${server.ip}/user/emailAuth`, userID);
																	if (emailDatas.value === 'Email Sent') {
																			setIdHelperText('이메일이 전송되었습니다.');
																			setHiddenAuth(false);
																			setEmailAuthData(emailDatas.number);
																			setVerButtonInactive(true);
																	}
																	else if(emailDatas.value === 'Email Error') {
																			setIdHelperText('이메일이 전송되지 못했습니다. 다시 시도해 주세요.');
																			setIdError(true);
																	}
															}
															else if (userDatas.value === 'Duplicate Email'){
																	setIdHelperText('이미 가입된 계정입니다.');
																	setIdError(true);
															}
															else if(userDatas.value === 'Wrong Email'){
																	setIdHelperText('이메일 형식이 잘못되었습니다.');
																	setIdError(true);
															}
													}}
													>
													인증
													</Button>
											</Grid>
									</Grid>
									<Grid container spacing={2} alignItems="center">
										<Grid item xs={10}>
											<TextField
											disabled={hiddenAuth}
											variant="outlined"
											required
											fullWidth
											id="verification"
											label="인증번호"
											name="verification"
											autoComplete="verification"
											helperText={verHelperText}
											error={verError}
											onChange={(event) => {
													setVerification(event.target.value);
													setVerHelperText('');
													setVerError(false);
											}}
											/>
										</Grid>
										<Grid item xs={2}>
											<Button
											color="primary"
											disabled={hiddenAuth}
											fullWidth
											size="large"
											onClick={async () => {
													if(verification == emailAuthData){
															setVerHelperText('인증번호가 일치합니다.');
															setEmailAuth(true);
															setHiddenAuth(true);
													}
													else{
															setVerHelperText('잘못된 인증번호입니다.');
															setVerError(true);
													}
											}}
											>
											확인
											</Button>
										</Grid>
									</Grid>
									<TextField
										variant="outlined"
										margin="normal"
										required
										fullWidth
										name="password"
										label="비밀번호"
										type="password"
										id="password"
										autoComplete="current-password"
										helperText={pwHelperText}
										error={pwError}
										onChange={(event) => {
												setPassword(event.target.value);
												if (event.target.value.length < 8) {
													setPwHelperText('비밀번호는 8자 이상 20자 이하로 입력해주세요');
													setPwError(true);
												}
												else if (event.target.value.length > 20) {
														setPwHelperText('비밀번호는 8자 이상 20자 이하로 입력해주세요');
														setPwError(true);
														event.target.value = event.target.value.slice(0, -1);
												} else {
													setPwHelperText('');
													setPwError(false);
												}
										}}
									/>
									<TextField
										variant="outlined"
										margin="normal"
										required
										fullWidth
										name="passwordcheck"
										label="비밀번호확인"
										type="password"
										id="passwordcheck"
										autoComplete="current-password-check"
										helperText={pwCheckHelperText}
										error={pwCheckError}
										onChange={(event) => {
												setPasswordCheck(event.target.value);
												setPwCheckHelperText('');
												setPwCheckError(false);
										}}
									/>
									<Button
										disabled={signUpInactive}
										fullWidth
										variant="contained"
										size="large"
										color="primary"
										className={classes.submit}
										onClick={async () => {
											const userDatas = await postRegister(`${server.ip}/user/register`, userName, userID, password);

											if(userDatas.value === 'Success'){
													const userDatas = await postLogin(`${server.ip}/user/login`, userID, password);
													setModalTitle('환영합니다.')
													setModalMessage('회원가입이 완료되었습니다. 리프레시와 신선한 하루를 만드세요.');
													setModalOpen(true);
											}
											else {
												setModalTitle('죄송합니다.')
												setModalMessage('오류가 발생했습니다. 회원가입을 다시 시도해 주세요.');
											}
										}}
									>
										회원가입
									</Button>
									<Modal
										aria-labelledby="transition-modal-title"
										aria-describedby="transition-modal-description"
										className={classes.modal}
										open={modalOpen}
										onClose={modalClose}
										disableBackdropClick
									>
										<Fade in={modalOpen}>
											<div className={classes.modalpaper}>
												<h2 id="transition-modal-title">{modalTitle}</h2>
												<p id="transition-modal-description">{modalMessage}</p>
												<div className={classes.mdbutton}>
													<Button
													onClick={() => {
														history.push("/");
													}}
													>확인</Button>
												</div>
											</div>
										</Fade>
									</Modal>
									<Grid container justifyContent="flex-end">
										<Grid item>
											<Link component={RouterLink} to="/signin" color="secondary" variant="body2">
												이미 계정이 있으신가요? 로그인 하러 가기
											</Link>
										</Grid>
									</Grid>
									<Box mt={5}>
										<Copyright />
									</Box>
								</Container>
							</form>
						</div>
					</Grid>
			</Grid>
	);
}
