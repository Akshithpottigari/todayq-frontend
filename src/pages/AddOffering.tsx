import { ROUTE_PATHS } from "@/App";
import { CREATE_OFFER_API } from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/useStore";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
type Props = {};

function AddOffering({}: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);

  const { authData, setAuthData } = useStore();

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let { data } = await CREATE_OFFER_API(form);
      if (data.data) {
        toast({
          title: "Offer created",
        });
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

    // Pass the publisher id in api call and make a success and destructive toaster;
    // After successful call, reset the form.
  };

  if (authData) {
    if (authData.user.type != "publisher") {
      return (
        <div className="w-full h-full min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold">
            This is a restricted route. Only publishers can access this.
          </h1>
          <Button variant={"link"}>
            <Link to={`../${ROUTE_PATHS.DASHBOARD}`}>Go to Dashboard</Link>
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full min-h-screen bg-background p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-semibold">Add Offering</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="space-y-4 w-full max-w-screen-sm"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            onChange={handleChange}
            placeholder="Name"
            type="text"
            name="name"
            minLength={3}
            maxLength={25}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            onChange={handleChange}
            placeholder="Description"
            name="description"
            minLength={3}
            maxLength={255}
          />
        </div>
        <div>
          <Label htmlFor="price">Price (in $)</Label>
          <Input
            name="price"
            id="price"
            onChange={handleChange}
            placeholder="1"
            type="number"
            min={1}
            max={999999}
          />
        </div>
        <div>
          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
          </Button>
          <Button variant={"link"}>
            <Link to={`../${ROUTE_PATHS.DASHBOARD}`}>Go to Dashboard</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddOffering;
