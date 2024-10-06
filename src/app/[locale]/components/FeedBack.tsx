import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, grey, blueGrey } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Rating from '@mui/material/Rating';
import { publicClient } from '@/src/utils/client';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";

import { contractAddress, contractAbi } from "../../../constants";
import { useState } from 'react';
import { Box } from '@mui/material';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export interface FeedBackProps {
  productTitle?: string;
  owner?: string
  description?: string;
  company?: string;
  productId?: string;
  note?: number;
  likeCount?: number;
  handleLike?: () => void;
}


const ChildFeedBackHeader = ({id, owner, description, note} : { id?: string, owner?: string, description?: string, note: number}) => {
  const [productDetails, setProductDetails] = useState<any>(null);
  const { address } = useAccount();
  const [stateSnack, setStateSnack] = useState({
    stat: false,
    type: "error",
    message: "Error occurred while processing your request",
  });
  const handleOpenSnack = (input: any) =>
    setStateSnack({
      stat: input.stat,
      type: input.type,
      message: input.message,
    });
  const handleCloseSnack = () =>
    setStateSnack({
      stat: false,
      type: stateSnack.type,
      message: stateSnack.message,
    });
  
  const getProductDetailsById = async (idProduct: string) => {
    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getProductDetailsById",
        account: address,
        args: [idProduct],
      });
      return data;
    } catch (error) {
      handleOpenSnack({ stat: true, type: "error", message: error.message });
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductDetailsById(id);
        setProductDetails(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      {productDetails && (
        <>
          <CardHeader avatar={
            <Avatar sx={{ bgcolor: grey[500] }} aria-label="recipe">
              {owner}
            </Avatar>
          }
          action={<p>06/10/24</p>}
        />
        <CardContent>
          <Box display={"flex"} justifyItems={"center"} mb={1}>
            <Typography variant="body1" sx={{ color: 'text.secondary', marginRight: 2 }}>Produit acheté: </Typography>
            <p>{productDetails?.productRef}</p>
          </Box>
          <Box display={"flex"} justifyItems={"center"} mb={2}>
            <Typography variant="body1" sx={{ color: 'text.secondary', marginRight: 2 }}>Note: </Typography>
            <Rating value={5} readOnly />
          </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Description: {description}
        </Typography>
      </CardContent>
      </>
      )}
    </div>
  );
};


export const FeedBack = (props: FeedBackProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const { owner, description, company, productId, note, productTitle, handleLike, likeCount} = props;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log("productId ", productId)

  return (
    <Card style={{height: 300}}>
      <ChildFeedBackHeader id={productId} note={3} owner={owner} description={description}/>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <FavoriteIcon />
        </IconButton>
        <div>{Number(likeCount)}</div>
        <IconButton aria-label="comment">
          <CommentIcon />
        </IconButton>
        <div>0</div>
      </CardActions>
    </Card>
  );
}
