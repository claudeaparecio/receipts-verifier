import {
  Typography,
  Grid,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  IconButton,
  Input,
  Tabs,
  Tab,
  Radio,
  Checkbox,
  Tooltip,
  Badge,
} from '@mui/material'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import HtmlParser from 'react-html-parser';
import { Looks3, Looks4, LooksOne, LooksTwo } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

enum FileTypes {
  Receipt = 'receipt',
  Shipping = 'shipping',
  Promo = 'promo',
  Skipped = 'skipped',
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Main = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [currentHTMLContent, setCurrentHTMLContent] = useState<any>('');

  const [receiptEmails, setReceiptEmails] = useState<string[]>([]);
  const [promoNoticeEmails, setPromoNoticeEmails] = useState<string[]>([]);
  const [shippingNoticeEmails, setShippingNoticeEmails] = useState<string[]>([]);
  const [emailViewIndex, setEmailViewIndex] = useState(0)
  const [isStartClicked, setIsStartClicked] = useState(false);
  const [shouldRemoveFileType, setShouldRemoveFileType] = useState(true);
  const [isDone, setIsDone] = useState(true);
  const progressContainerRef = useRef<HTMLUListElement>(null)
  const [currentActiveFile, setCurrentActiveFile] = useState('');

  const handleFileChange = (event: any) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      const newFiles: any = [...files];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          newFiles.push({ name: file.name, content: fileContent });
        };
        reader.readAsText(file);
      }
      setFiles(newFiles);
    }
  };

  const getValidation = ({ fileName, listOne, listTwo, listOneName, listTwoName }: {
    fileName: string;
    listOne: any[];
    listTwo: any[];
    listOneName: string;
    listTwoName: string;
  }) => {
    const listOneIndex = listOne.findIndex((item: any) => item === fileName)
    if (listOneIndex !== -1) {
      return { error: `Item Already Exist in ${listOneName}, move the item into its respective section from there.` }
    }

    const listTwoIndex = listTwo.findIndex((item: any) => item === fileName)
    if (listTwoIndex !== -1) {
      return { error: `Item Already Exist in ${listTwoName}, move the item into its respective section from there.` }
    }
  }

  const handleNextClick = () => {
    if (currentFileIndex < files.length - 1) {
      const nextFileIndex = currentFileIndex + 1;
      const nextFile: any = files[nextFileIndex];
      setCurrentFileIndex(nextFileIndex);
      setCurrentHTMLContent(nextFile.content);
      setCurrentActiveFile(nextFile.name);
    } else {
      setIsDone(true);
    }
  };

  const appendEmailType = (fileName: string, type: FileTypes) => {
    setFiles(data => data.map((item) => item?.name === fileName ? { ...item, type } : item))
  }

  const addToShippings = useCallback(() => {
    let fileName = files[currentFileIndex]?.name;

    const validation = getValidation({ fileName, listOne: receiptEmails, listTwo: promoNoticeEmails, listOneName: 'Receipts', listTwoName: 'Promo Notice' });

    if (validation?.error) {
      alert(validation?.error);
      return;
    }
    if (fileName && !shippingNoticeEmails.includes(fileName)) {
      appendEmailType(fileName, FileTypes.Shipping);
      setShippingNoticeEmails(emails => emails.concat(fileName));
      setEmailViewIndex(1);
    }
    handleNextClick()
  }, [currentFileIndex]);

  const addToReceipts = useCallback(() => {
    let fileName = files[currentFileIndex]?.name;

    const validation = getValidation({ fileName, listOne: shippingNoticeEmails, listTwo: promoNoticeEmails, listOneName: 'Shipping Notice', listTwoName: 'Promo Notice' });

    if (validation?.error) {
      alert(validation?.error);
      return;
    }

    if (fileName && !receiptEmails.includes(fileName)) {
      appendEmailType(fileName, FileTypes.Receipt);
      setReceiptEmails(emails => emails.concat(fileName));
      setEmailViewIndex(0);
    }
    handleNextClick()
  }, [currentFileIndex]);

  const addToPromos = useCallback(() => {
    let fileName = files[currentFileIndex]?.name;

    const validation = getValidation({ fileName, listOne: receiptEmails, listTwo: shippingNoticeEmails, listOneName: 'Receipts', listTwoName: 'Shipping Notice' });

    if (validation?.error) {
      alert(validation?.error);
      return;
    }

    if (fileName && !promoNoticeEmails.includes(fileName)) {
      appendEmailType(fileName, FileTypes.Promo);
      setPromoNoticeEmails(emails => emails.concat(fileName));
      setEmailViewIndex(2);
    }
    handleNextClick()
  }, [currentFileIndex]);

  const onClickNext = useCallback(() => {
    let fileName = files[currentFileIndex]?.name;
    appendEmailType(fileName, FileTypes.Skipped)
    handleNextClick();
  }, [currentFileIndex])

  const handleKeyUp = useCallback((e: any) => {
    const key = e.key;

    if (key === '1') {
      var addToReceiptButton = document.getElementById('add_to_receipt_button');
      addToReceiptButton?.click();
    }

    if (key === '2') {
      var addToShippingButton = document.getElementById('add_to_shipping_button');
      addToShippingButton?.click();
      return
    }

    if (key === '3') {
      var addToPromoButton = document.getElementById('add_to_promo_button');
      addToPromoButton?.click();
      return
    }

    if (key === '4') {
      var nextButton = document.getElementById('next_button');
      nextButton?.click();
    }
  }, [currentFileIndex]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };

  }, []);

  const moveReceiptToPromo = (name: string) => {
    setReceiptEmails(receipts => receipts.filter(receipt => receipt !== name))
    setPromoNoticeEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Promo);
    setEmailViewIndex(2);
  }

  const moveReceiptToShipping = (name: string) => {
    setReceiptEmails(receipts => receipts.filter(receipt => receipt !== name))
    setShippingNoticeEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Shipping);
    setEmailViewIndex(1);
  }

  const moveShippingToPromo = (name: string) => {
    setShippingNoticeEmails(emails => emails.filter(email => email !== name))
    setPromoNoticeEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Promo);
    setEmailViewIndex(2);
  }

  const moveShippingToReceipt = (name: string) => {
    setShippingNoticeEmails(receipts => receipts.filter(receipt => receipt !== name))
    setReceiptEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Receipt);
    setEmailViewIndex(0);
  }

  const movePromoToReceipt = (name: string) => {
    setPromoNoticeEmails(emails => emails.filter(email => email !== name))
    setReceiptEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Receipt);
    setEmailViewIndex(0);
  }

  const movePromoToShipping = (name: string) => {
    setPromoNoticeEmails(receipts => receipts.filter(receipt => receipt !== name))
    setShippingNoticeEmails(emails => emails.concat(name));
    appendEmailType(name, FileTypes.Shipping);
    setEmailViewIndex(1);
  }

  const [emailList, setEmailList] = useState<string[]>([]);
  const renderViewEmailList = (index: number) => {

    return emailList.map((email, i) => {
      const isFileSelected = email === currentActiveFile;
      return (
        <>
          <Tooltip title={email}>
            <Box
              key={`email.${i}`}
              display="flex"
              onClick={() => {
                const index = files.findIndex(item => item?.name === email)
                const data = files.find(item => item?.name === email);
                setCurrentFileIndex(index);
                setCurrentHTMLContent(data?.content);
                setCurrentActiveFile(data?.name);
              }}
              sx={{ justifyContent: "space-between", alignItems: "center", cursor: 'pointer', bgcolor: isFileSelected ? '#CBC3E3' : 'inherit', py: 1 }}
            >
              <Typography variant="subtitle1" component="div" sx={{ width: "200px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {email}
              </Typography>
              {index === 0 && <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => moveReceiptToPromo(email)}
                  color="warning"
                >
                  Move to Promo
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => moveReceiptToShipping(email)}
                  color="info"
                >
                  Move to Shipping
                </Button>
              </>}
              {index === 1 && <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => moveShippingToReceipt(email)}
                  color="primary"
                >
                  Move to Receipt
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => moveShippingToPromo(email)}
                  color="warning"
                >
                  Move to Promo
                </Button>
              </>}
              {index === 2 && <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => movePromoToShipping(email)}
                  color="info"
                >
                  Move to Shipping
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => movePromoToReceipt(email)}
                  color="primary"
                >
                  Move to Receipt
                </Button>
              </>}
            </Box>
          </Tooltip>
          <Divider sx={{ my: 1 }} />
        </>
      )
    });
  };


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setEmailViewIndex(newValue);
  };

  useEffect(() => {
    let list = []
    switch (emailViewIndex) {
      case 0:
        list = receiptEmails;
        break;
      case 1:
        list = shippingNoticeEmails;
        break;
      case 2:
        list = promoNoticeEmails;
        break;
      default:
        list = receiptEmails;
        break;
    }
    setEmailList(list);
  }, [emailViewIndex, currentHTMLContent, isDone])

  const clearAll = () => {
    setIsStartClicked(false);
    setReceiptEmails([])
    setPromoNoticeEmails([])
    setShippingNoticeEmails([]);
    setFiles([]);
    setCurrentHTMLContent('');
    setCurrentActiveFile('');
    setEmailViewIndex(0);
    setCurrentFileIndex(-1);
  }

  const currentFileIndexString = currentFileIndex === -1 ? 0 : currentFileIndex + 1;


  const currentTabName = emailViewIndex === 0 ? 'Receipts' : emailViewIndex === 1 ? 'Shipping Notice Emails' : emailViewIndex === 2 ? 'Promo Notice Emails' : ''

  const copyCurrentTab = useCallback(async () => {
    const data = emailList.reduce((string, email) => {
      if (shouldRemoveFileType) {
        return string += `${email.replace('.html', '')}\n`
      } else {
        return string += `${email}\n`
      }
    }, '');

    await navigator.clipboard.writeText(data);
  }, [emailViewIndex, emailList, shouldRemoveFileType]);

  const copyProgress = useCallback(async () => {
    let data
    const lastScannedIndex = files.findIndex(item => item.type === undefined || item.type === null);

    if (lastScannedIndex === -1) {
      data = files.reduce((string, email) => {
        return string += `${email.name}\n`
      }, '');
    } else {
      data = files.slice(0, lastScannedIndex).reduce((string, email) => {
        return string += `${email.name}\n`
      }, '');
    }

    await navigator.clipboard.writeText(data);
  }, [files]);

  return (
    <Grid sx={{ px: '16px' }} height="100vh" direction="column">
      <Grid container alignItems="center" height="10vh" sx={{ borderBottom: "1px solid lightgrey" }}>
        <Typography variant='h4' sx={{ flexGrow: 1 }} >
          Noted: File Verifier
        </Typography>
        <Box>
          {!isStartClicked &&
            <>
              <Button
                variant="contained"
                component="label"
                htmlFor="fileInput"
                sx={{ mr: 1 }}
              >
                Select Files
              </Button>
              <input style={{ display: 'none' }} type="file" id="fileInput" multiple onChange={handleFileChange} />
              <Button
                variant="contained"
                onClick={() => {
                  setIsStartClicked(true)
                  setIsDone(false);
                  handleNextClick()
                }}
                color='success'
              >
                Start
              </Button>
            </>
          }
          {isStartClicked && <Button
            variant="contained"
            onClick={clearAll}
            color='inherit'
            disabled={!isStartClicked}
          >
            Restart
          </Button>}
        </Box>
      </Grid>
      <Grid item container md={12} >
        <Grid p={1} item container direction="column" md={4} >
          <Grid p={1} container>
            <Typography flexGrow={1} fontSize="22px"
              fontWeight="bold">Progress</Typography>
            <Typography fontSize="22px"
              fontWeight="bold">{currentFileIndexString}/{files?.length}</Typography>
          </Grid>
          <Grid item overflow='auto' height='200px' container>
            <Grid md={12} textAlign='left'>
              <List ref={progressContainerRef} dense={true}>
                {files.map((file: any, index) => {
                  const type = file?.type;
                  const bgcolor = type === FileTypes.Receipt ? '#230448' : type === FileTypes.Promo ? '#FFBF42' : type === FileTypes.Shipping ? '#0188D1' : 'inherit';
                  const color = type === FileTypes.Receipt ? '#ffffff' : type === FileTypes.Promo ? '#000000' : type === FileTypes.Shipping ? '#ffffff' : 'inherit';
                  const isSelected = index === currentFileIndex;
                  return (
                    <ListItemButton autoFocus={isSelected} selected={index === currentFileIndex} key={index} onClick={() => {
                      setCurrentFileIndex(index)
                      setCurrentHTMLContent(file?.content);
                      setCurrentActiveFile(file?.name);
                    }}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#CBC3E3",
                          ":hover": {
                            backgroundColor: "#CBC3E3",
                          }
                        }
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography sx={{ width: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }} fontSize="14px">
                              {file.name}
                            </Typography>
                          }
                        />
                        <Box borderRadius={5} p={1} bgcolor={bgcolor}>
                          <Typography fontWeight='bold' textTransform='capitalize' fontSize='10px' color={color}>
                            {file.type}
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider />
                    </ListItemButton>
                  )
                })}
              </List>
            </Grid>
          </Grid>
          <Button onClick={copyProgress} sx={{ py: 2, mt: 2 }} variant='contained' color='primary'>
            Copy Last Progress
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={emailViewIndex} onChange={handleTabChange}>
                <Tab label={`Receipts (${receiptEmails.length})`} {...a11yProps(0)} />
                <Tab label={`Shipping Notice (${shippingNoticeEmails.length})`} {...a11yProps(1)} />
                <Tab label={`Promo Notice (${promoNoticeEmails.length})`} {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={emailViewIndex} index={0} />
            <CustomTabPanel value={emailViewIndex} index={1} />
            <CustomTabPanel value={emailViewIndex} index={2} />
          </Box>
          <Grid boxShadow={1} rowGap={1} p={2} textAlign={'left'} height={'500px'} overflow='auto'>
            {renderViewEmailList(emailViewIndex)}
          </Grid>
          <Button onClick={copyCurrentTab} sx={{ py: 2, mt: 2 }} variant='contained' color='primary'>
            Copy {currentTabName}
          </Button>
          <Grid>
            <Checkbox value={shouldRemoveFileType} defaultChecked onChange={e => setShouldRemoveFileType(e.target.checked)} />
            Remove file type (.html)
          </Grid>
        </Grid>
        {/* Email viewer */}
        <Grid item md={6} height="90vh" container justifyContent="center" sx={{ overflow: "auto", overflowX: 'auto' }} bgcolor="lightgrey" >
          {HtmlParser(currentHTMLContent)}
        </Grid>
        {/* Buttons */}
        <Grid item container direction="column" rowGap={2} md={2} pl={2}>
          <Button id='add_to_receipt_button' sx={{ height: "100px" }} startIcon={<LooksOne />} variant='contained' color='primary' onClick={addToReceipts} disabled={isDone}>
            ADD TO RECEIPTS
          </Button>
          <Button id='add_to_shipping_button' sx={{ height: "100px" }} startIcon={<LooksTwo />} variant='contained' color='info' onClick={addToShippings} disabled={isDone}>
            ADD TO SHIPPING
          </Button>
          <Button id='add_to_promo_button' sx={{ height: "100px" }} startIcon={<Looks3 />} variant='contained' color='warning' onClick={addToPromos} disabled={isDone}>
            ADD TO PROMOS
          </Button>
          <Button id='next_button' sx={{ height: "100px" }} startIcon={<Looks4 />} variant='contained' color='error' onClick={onClickNext} disabled={isDone}>
            NEXT
          </Button>
        </Grid>

      </Grid>

    </Grid >
  );
};

export default Main;