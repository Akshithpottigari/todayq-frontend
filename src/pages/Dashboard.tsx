import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/App";
import { useStore } from "@/hooks/useStore";
import { useToast } from "@/components/ui/use-toast";
import {
  GET_CART_API,
  GET_OFFERS_API,
  GET_OFFERS_API_PARAMS,
  UPSERT_CART_API,
} from "@/axiosInstance";
import Loading from "@/components/Loading";

type Props = {};

function Dashboard({}: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authData, setAuthData } = useStore();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [cart, setCart] = useState<any>({ items: [] });
  const [filterForm, setFilterForm] = useState<{
    name?: string;
    priceMin?: number;
    priceMax?: number;
    price?: number;
    date?: number;
  }>({
    name: undefined,
    priceMin: undefined,
    priceMax: undefined,
    price: undefined,
    date: undefined,
  });

  useEffect(() => {
    GET_OFFERS();
    if (authData?.user?.type == "user") GET_CART();
  }, []);

  async function GET_OFFERS(params?: GET_OFFERS_API_PARAMS) {
    setLoading(true);
    try {
      let { data } = await GET_OFFERS_API(params);
      if (data.data) {
        setOffers(data.data);
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  }

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

  const handleFilter = async (e: any) => {
    e.preventDefault();
    setFilterSheetOpen(false);
    GET_OFFERS(filterForm);
  };

  const handleFilterFormChange = (e: any) => {
    setFilterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddToCart = async (item: any) => {
    let tempCart = cart;

    if (tempCart?.items) {
      tempCart.items.push(item);
    }

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

  return (
    <div className="w-full h-full min-h-screen bg-background">
      {/* Navbar */}
      <div className="h-12 bg-primary text-primary-foreground flex items-center justify-between px-3 py-1.5">
        <span className="font-medium text-xl">Koinpr</span>
        <Button
          onClick={() => {
            localStorage.removeItem("authData");
            setAuthData(null);
            navigate(ROUTE_PATHS.LOGIN);
          }}
        >
          Logout
        </Button>
      </div>
      {/* offers */}
      <div className="w-full">
        <div className=" mt-4 w-full flex items-center justify-between">
          <h1 className="font-semibold text-3xl">Koinpr Marketplace</h1>
          {authData?.user?.type == "publisher" && (
            <Button asChild>
              <Link to={ROUTE_PATHS.ADD_OFFERING}>Add Offering</Link>
            </Button>
          )}

          {/* Cart */}
          {cart && (
            <Sheet>
              <Button
                className="items-center gap-1.5"
                variant={"secondary"}
                asChild
              >
                <SheetTrigger>Cart</SheetTrigger>
              </Button>
              <SheetContent className="w-full flex flex-col gap-3 items-start justify-start">
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>Items in your cart</SheetDescription>
                {cart?.length == 0 ||
                  (cart?.items?.length == 0 && (
                    <p>Cart is empty. Try adding some items to cart</p>
                  ))}
                {cart?.items?.map((item: any) => (
                  <Card className="max-w-[250px] w-full p-3" key={item._id}>
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
                    <p>Total: ${calculateTotal(cart)}</p>
                    <Button asChild>
                      <Link to={`../${ROUTE_PATHS.CHECKOUT}`}>Checkout</Link>
                    </Button>
                  </>
                )}
              </SheetContent>
            </Sheet>
          )}
          {/* Filters */}
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <Button
              className="items-center gap-1.5"
              variant={"secondary"}
              asChild
            >
              <SheetTrigger>
                Filters <Filter className="w-4 h-4" />
              </SheetTrigger>
            </Button>
            <SheetContent className="w-full flex flex-col gap-3 items-start justify-start">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Choose the filters below to get specific offers.
              </SheetDescription>
              <form onSubmit={handleFilter} action="" className="space-y-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    onChange={handleFilterFormChange}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Offer name"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="priceMin">Min. Price</Label>
                  <Input
                    onChange={handleFilterFormChange}
                    id="priceMin"
                    name="priceMin"
                    type="number"
                    min={0}
                    max={999999}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="priceMax">Max. Price</Label>
                  <Input
                    onChange={handleFilterFormChange}
                    id="priceMax"
                    name="priceMax"
                    type="number"
                    min={0}
                    max={999999}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="priceMax">Sort by price</Label>
                  <Select
                    name="price"
                    onValueChange={(v) =>
                      setFilterForm((prev) => ({ ...prev, price: parseInt(v) }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Asc</SelectItem>
                      <SelectItem value="-1">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="priceMax">Sort by date</Label>
                  <Select
                    name="date"
                    onValueChange={(v) =>
                      setFilterForm((prev) => ({ ...prev, date: parseInt(v) }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Latest first</SelectItem>
                      <SelectItem value="-1">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 items-center justify-start">
          {loading && <Loading />}
          {offers.length == 0 && !loading && <p>No offers are there.</p>}
          {offers.length > 0 &&
            offers.map((item) => (
              <Card
                className="max-w-[250px] w-full max-h-[250px] h-full p-3"
                key={item._id}
              >
                <CardContent className="space-y-1.5">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    {item.description}
                  </p>
                  <Separator />
                  <h3 className="font-semibold text-2xl">${item.price}</h3>
                  <Button
                    disabled={cart?.items?.find((i: any) => i._id === item._id)}
                    onClick={() => handleAddToCart(item)}
                  >
                    {cart?.items?.find((i: any) => i._id === item._id)
                      ? "In cart"
                      : "Add to cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

const calculateTotal = (data: any) => {
  let total = 0;

  if (data.items && data.items.length > 0) {
    data.items.forEach((item: any) => {
      total += item.price;
    });
  }

  return total;
};
