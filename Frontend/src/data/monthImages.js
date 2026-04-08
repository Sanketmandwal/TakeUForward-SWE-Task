import JanImage from "../assets/Jan.jpg";
import FebImage from "../assets/Feb.jpg";
import MarImage from "../assets/Mar.jpg";
import AprImage from "../assets/Apr.jpg";
import MayImage from "../assets/May.jpg";
import JunImage from "../assets/Jun.jpg";
import JulImage from "../assets/Jul.jpg";
import AugImage from "../assets/Aug.jpg";
import SepImage from "../assets/Sep.jpg";
import OctImage from "../assets/Oct.jpg";
import NovImage from "../assets/Nov.jpg";
import DecImage from "../assets/Dec.jpg";

export const MONTH_IMAGES = [
  JanImage,
  FebImage,
  MarImage,
  AprImage,
  MayImage,
  JunImage,
  JulImage,
  AugImage,
  SepImage,
  OctImage,
  NovImage,
  DecImage,
];

export const getMonthImage = (monthIndex) =>
  MONTH_IMAGES[monthIndex] ?? MONTH_IMAGES[0];
