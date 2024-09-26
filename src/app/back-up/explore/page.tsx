"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@prisma/client";
import { getProfessionalsByService } from "@/data/back-up";
import { HeaderSection } from "@/components/shop/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { ConfigProvider, Slider } from "antd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { StarOutlined, StarFilled, StarTwoTone } from "@ant-design/icons";
import "../explore/global.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Link from "next/link";

export default function ExplorePage() {
  const searchParams = useSearchParams();

  const mark = {
    0: "0",
    50: "50",
    100: "100",
    150: "150",
    200: "200+",
  };

  interface Publication {
    id: string;
    name: string;
    imageProfil: string;
    ville: string;
    pays: string;
    prix: number;
    starRating: number;
    category: string;
    isAtHome: boolean;
    idUser: string;
  }

  const [publication, setPublication] = useState<Publication[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number[]>([50, 150]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? null : value);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(publication.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = publication.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/serviceProfessional/get", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await response.json();
        const mappedData = data.map((item) => ({
          id: item.id,
          name: item.title,
          imageProfil: item.user.image,
          ville: item.user.address.city,
          pays: item.user.address.country,
          prix: parseFloat(item.price),
          category: item.category,
          isAtHome: item.domicile,
          idUser: item.user.id,
        }));
        setPublication(mappedData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  function ModelPublication({ publication }: { publication: Publication }) {
    return (
      <Card style={{ margin: 0 }} className="min-w-[330px] rounded-md">
        <div className="relative">
          <Image
            src={"/nail-salon.webp"}
            width={1000}
            height={1000}
            alt="Picture of the author"
            className="rounded-md object-cover"
          />

          <button
            style={{ padding: "9px", background: "#F8F8F8" }}
            className="absolute text-sm top-2 left-2 rounded-md text-black"
          >
            {publication.category}
          </button>
          <Link href={`/back-up/Profil/${publication.idUser}`}>
            <img
              style={{
                width: "40px",
                height: "40px",
                border: "solid 2px white",
              }}
              className="object-cover absolute bottom-2 right-2 rounded-full"
              src={publication.imageProfil}
              alt=""
            />
          </Link>
        </div>
        <br />
        <CardContent>
          <div>{publication.name}</div>
          <div className="flex justify-between items-center">
            <div className="flex items-center" style={{ marginTop: "3%" }}>
              <img src={"/iconService/map-pin-3.svg"} alt="map.icon" />
              <span style={{ color: "#CECECE", marginLeft: "5px" }}>
                {publication.isAtHome ? (
                  <span style={{ color: "#CECECE" }}>À Domicile</span>
                ) : (
                  <span style={{ color: "#CECECE" }}>{publication.ville}</span>
                )}
                ,
              </span>
              <span style={{ color: "#CECECE", marginLeft: "5px" }}>
                {publication.pays}
              </span>
            </div>
            <div
              className="flex items-center"
              style={{ color: "#CECECE", marginTop: "3%", marginRight: "2px" }}
            >
              <StarFilled
                style={{
                  color: "#F7F74A",
                  fontSize: "24px",
                  marginRight: "5px",
                }}
              />{" "}
              {publication.starRating}/5
            </div>
          </div>
          <br />
          <div className="flex justify-between">
            <span>
              A partir de{" "}
              <span style={{ fontWeight: "700", fontSize: "150%" }}>
                {publication.prix} €
              </span>
            </span>
            <Link href={`/back-up/servicePage/${publication.id}`}>
              <Button>Réserver</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <HeaderSection title="Explorez les professionnels de la beauté" />
      <div className="h-full flex-1 flex-col space-y-8 pl-4 pr-2 pt-8 md:flex">
        <div className="flex">
          <div className="col-span-3 min-w-64 max-w-64">
            <div className="bg-gray-100 rounded p-4">
              <h1>Rechercher</h1>
              <Input
                className="w-full bg-white text-gray-700 mt-2"
                placeholder="Que recherchez-vous ?"
                type="text"
              />
            </div>
            <div className="bg-gray-100 rounded p-4 mt-4">
              <h1>Lieux</h1>
              <Input
                className="w-full bg-white text-gray-700 mt-2"
                placeholder="Indiquer un lieu"
                type="text"
              />
            </div>
            <div className="bg-gray-100 rounded p-4 mt-4">
              <h1>Catégories de Services</h1>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full bg-white mt-2">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="w-full bg-white">
                  <SelectGroup>
                    <SelectLabel>Catégories</SelectLabel>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="coiffures">Coiffures</SelectItem>
                    <SelectItem value="soins">Soins de la Peau</SelectItem>
                    <SelectItem value="estheticienne">Esthéticienne</SelectItem>
                    <SelectItem value="massages">Massages</SelectItem>
                    <SelectItem value="bien-etre">Bien-être</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-100 rounded p-4 mt-4">
              <h1>Prix</h1>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimaryBorderHover: "#000",
                  },
                  components: {
                    Slider: {
                      dotActiveBorderColor: "#000",
                      handleActiveColor: "#000",
                      handleColor: "#000",
                      trackBg: "#000",
                      trackHoverBg: "#000",
                      handleColorDisabled: "#000",
                    },
                  },
                }}
              >
                <Slider
                  style={{ width: "95%" }}
                  className="mt-4"
                  marks={mark}
                  step={5}
                  max={200}
                  range
                  onChange={handleSliderChange}
                />
              </ConfigProvider>
              <span className="block mt-2">
                Prix: {sliderValue[0]} € - {sliderValue[1]} €
              </span>
            </div>
            <button className="bg-black rounded text-white text-lg mt-4 w-full py-3">
              Rechercher
            </button>
          </div>
          <div style={{ marginLeft: "2%" }}>
            <div className="grid grid-cols-custom gap-4 mr-4">
              {currentItems && currentItems.length > 0 ? (
                currentItems.map((pub) => (
                  <ModelPublication key={pub.id} publication={pub} />
                ))
              ) : (
                <div>Aucun resultat present</div>
              )}
            </div>
            <br />
            <Pagination>
              <PaginationContent>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem
                    key={index + 1}
                    isActive={index + 1 === currentPage}
                  >
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(index + 1)}
                      className={
                        index + 1 === currentPage ? "bg-black text-white" : ""
                      }
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}
