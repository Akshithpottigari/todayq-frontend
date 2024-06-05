import { ROUTE_PATHS } from "@/App";
import {
  CREATE_CHECKOUT,
  GET_CART_API,
  UPLOAD_DOCUMENT,
  UPSERT_CART_API,
} from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/hooks/useStore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Props = {};

function Checkout({}: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authData, setAuthData } = useStore();
  const [cart, setCart] = useState<any>({ items: [] });
  const [file, setFile] = useState<any>();

  function handleFileChange(event: any) {
    setFile(event.target.files[0]);
  }

  const [checkoutForm, setCheckForm] = useState({
    line1: "",
    line2: "",
    zipCode: "",
    state: "",
    country: "",
    cc: "",
    name: "",
  });
  useEffect(() => {
    if (authData?.user?.type == "user") GET_CART();
  }, []);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>({});

  if (authData) {
    if (authData.user.type != "user") {
      return (
        <div className="w-full h-full min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold">
            This is a restricted route. Only Users can access this.
          </h1>
          <Button variant={"link"}>
            <Link to={`../${ROUTE_PATHS.DASHBOARD}`}>Go to Dashboard</Link>
          </Button>
        </div>
      );
    }
  }

  const handleFormChange = (e: any) => {
    setCheckForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: any) => {
    e.preventDefault();
    try {
      let { cc, name, ...others } = checkoutForm;
      let body = {
        items: cart.items.map((item: any) => item._id),
        total: calculateTotal(cart),
        address: others,
        paymentDetails: { cc, name },
      };
      let { data } = await CREATE_CHECKOUT(body);
      if (data.data) {
        toast({
          title: "Successful",
        });
        setCheckoutData(data.data);
        setUploadDialogOpen(true);
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  };

  async function GET_CART() {
    try {
      let { data } = await GET_CART_API(authData.user._id);
      if (data.data) {
        setCart(
          data.data.length == 0 ? { items: [] } : { items: data.data[0].items }
        );
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  }

  const RemoveItemFromCart = async (item: any) => {
    let tempCart = cart;
    tempCart.items = tempCart.items.filter((i: any) => item._id != i._id);
    try {
      let { data } = await UPSERT_CART_API(tempCart);
      if (data.data) {
        toast({
          title: "Success",
        });
        setCart(tempCart);
        GET_CART();
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("fileName", file.name);
      let { data } = await UPLOAD_DOCUMENT(checkoutData._id, formData);
      if (data.data) {
        toast({
          title: "Uploaded",
        });
        setUploadDialogOpen(false);
        navigate(`../${ROUTE_PATHS.DASHBOARD}`);
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen h-full flex flex-col gap-4 items-center justify-center p-4">
      <span className="font-medium text-xl">Checkout</span>

      {cart?.length == 0 ||
        (cart?.items?.length == 0 && (
          <p>Cart is empty. Try adding some items to cart</p>
        ))}
      {cart?.items?.map((item: any) => (
        <Card className="w-full p-3" key={item._id}>
          <CardContent className="space-y-1.5">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm font-normal text-muted-foreground">
              {item.description}
            </p>
            <Separator />
            <h3 className="font-semibold text-2xl">${item?.price}</h3>
            <Button
              onClick={() => RemoveItemFromCart(item)}
              variant={"destructive"}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      {cart.items.length > 0 && (
        <>
          <p className="font-semibold text-lg">
            Total: ${calculateTotal(cart)}
          </p>
        </>
      )}

      <form
        onSubmit={handleCheckout}
        className="space-y-4 w-full max-w-screen-sm"
        action=""
      >
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="line1"
          placeholder="Line 1"
        />
        <Input
          onChange={handleFormChange}
          type="text"
          name="line2"
          placeholder="Line 2"
        />
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="zipCode"
          placeholder="Zip code"
        />
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="state"
          placeholder="State"
        />
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="country"
          placeholder="Country"
        />
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="cc"
          placeholder="Card number"
        />
        <Input
          onChange={handleFormChange}
          required
          type="text"
          name="name"
          placeholder="Name on CC"
        />
        <Button type="submit">Checkout</Button>
      </form>
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload the document here</DialogTitle>
          </DialogHeader>
          <form
            action=""
            onSubmit={handleFileUpload}
            className="grid w-full max-w-sm items-center gap-1.5"
          >
            <Label htmlFor="file">PDF</Label>
            <Input
              required
              accept=".pdf"
              onChange={handleFileChange}
              id="file"
              type="file"
            />
            <Button>Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Checkout;

const calculateTotal = (data: any) => {
  let total = 0;

  if (data.items && data.items.length > 0) {
    data.items.forEach((item: any) => {
      total += item.price;
    });
  }

  return total;
};
