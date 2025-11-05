"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { 
  Building2, Home, Trees, Waves, Upload, X, Plus,
  MapPin, DollarSign, Ruler, BedDouble, Bath, Car,
  Zap, Wifi, Droplet, Check, AlertCircle
} from "lucide-react";

const PROPERTY_TYPES = [
  { value: '', label: 'Select Property Type', icon: Building2 },
  { value: 'apartment', label: 'Apartment', icon: Building2, needsRooms: true },
  { value: 'house', label: 'House', icon: Home, needsRooms: true, needsLand: true },
  { value: 'chacara', label: 'Chácara (Small Rural <2ha)', icon: Trees, needsRural: true, isRural: true },
  { value: 'sitio', label: 'Sítio (2-50 hectares)', icon: Trees, needsRural: true, isRural: true },
  { value: 'fazenda', label: 'Fazenda (50+ hectares)', icon: Trees, needsRural: true, isRural: true },
  { value: 'rancho', label: 'Rancho (Near Water 2+ ha)', icon: Waves, needsRural: true, needsWater: true, isRural: true },
  { value: 'commercial', label: 'Commercial Property', icon: Building2 },
  { value: 'land', label: 'Land/Lot', icon: MapPin },
];

const AMENITIES = [
  'pool', 'gym', 'playground', 'sports_court', 'party_room', 'sauna',
  'garden', 'barbecue', 'gourmet_kitchen', 'home_office', 'balcony',
  'terrace', 'storage', 'laundry_room', 'service_area', 'maid_room',
  'solar_heating', 'air_conditioning', 'fireplace', 'wine_cellar',
  'home_theater', 'stable', 'barn', 'warehouse', 'chicken_coop',
  'orchard', 'crop_field', 'pasture_land', 'fencing', 'irrigation_system'
];

export default function PostPropertyPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('sale');

  // Pricing
  const [price, setPrice] = useState('');
  const [condominiumFee, setCondominiumFee] = useState('');
  const [iptuAnnual, setIptuAnnual] = useState('');
  const [acceptsFinancing, setAcceptsFinancing] = useState(true);
  const [acceptsExchange, setAcceptsExchange] = useState(false);

  // Location
  const [country, setCountry] = useState('Brazil');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Areas
  const [totalArea, setTotalArea] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');

  // Rooms (Urban)
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [suites, setSuites] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('');

  // Rural Features
  const [waterSource, setWaterSource] = useState('');
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const [soilQuality, setSoilQuality] = useState('');
  const [topography, setTopography] = useState('');
  const [vegetationType, setVegetationType] = useState('');
  const [nearWater, setNearWater] = useState(false);
  const [waterDistance, setWaterDistance] = useState('');

  // Building Features
  const [yearBuilt, setYearBuilt] = useState('');
  const [floors, setFloors] = useState('');
  const [furnished, setFurnished] = useState(false);

  // Documents
  const [hasDeed, setHasDeed] = useState(false);
  const [hasRegistration, setHasRegistration] = useState(false);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Photos
  const [photos, setPhotos] = useState<File[]>([]);

  const selectedTypeConfig = PROPERTY_TYPES.find(t => t.value === propertyType);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to post a property');
      }

      // Create property
      const propertyData = {
        user_id: user.id,
        title,
        description,
        property_type: propertyType,
        transaction_type: transactionType,
        price: parseFloat(price),
        condominium_fee: condominiumFee ? parseFloat(condominiumFee) : null,
        iptu_annual: iptuAnnual ? parseFloat(iptuAnnual) : null,
        accepts_financing: acceptsFinancing,
        accepts_exchange: acceptsExchange,
        country,
        state,
        city,
        neighborhood,
        address,
        zip_code: zipCode,
        total_area: totalArea ? parseFloat(totalArea) : null,
        built_area: builtArea ? parseFloat(builtArea) : null,
        land_area: landArea ? parseFloat(landArea) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms) : 0,
        suites: suites ? parseInt(suites) : 0,
        parking_spaces: parkingSpaces ? parseInt(parkingSpaces) : 0,
        water_source: waterSource || null,
        has_electricity: hasElectricity,
        has_internet: hasInternet,
        soil_quality: soilQuality || null,
        topography: topography || null,
        vegetation_type: vegetationType || null,
        near_water: nearWater,
        water_distance_meters: waterDistance ? parseInt(waterDistance) : null,
        year_built: yearBuilt ? parseInt(yearBuilt) : null,
        floors: floors ? parseInt(floors) : 1,
        furnished,
        has_deed: hasDeed,
        has_registration: hasRegistration,
        status: 'pending', // Requires admin approval
      };

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Insert amenities
      if (selectedAmenities.length > 0) {
        const amenitiesData = selectedAmenities.map(amenity => ({
          property_id: property.id,
          amenity_type: amenity,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenitiesData);

        if (amenitiesError) throw amenitiesError;
      }

      // Upload photos (simplified - in production use proper storage)
      // TODO: Implement photo upload to Supabase Storage

      setSuccess(true);
      setTimeout(() => {
        router.push('/proper');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B87333] via-[#DAA520] to-[#FFD700] bg-clip-text text-transparent mb-3">
            Post Your Property
          </h1>
          <p className="text-[#d8c68e]">Fill in the details to list your property</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-500">Property submitted successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#B87333] mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Property Type *
                  </label>
                  <select
                    required
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Transaction Type *
                  </label>
                  <select
                    required
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">For Lease</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Property Title *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Beautiful 3-bedroom apartment in downtown"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe your property in detail..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#B87333] mb-6">Pricing</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Price (USD) *
                </label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Condominium Fee (USD)
                </label>
                <input
                  type="number"
                  value={condominiumFee}
                  onChange={(e) => setCondominiumFee(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Annual Property Tax (USD)
                </label>
                <input
                  type="number"
                  value={iptuAnnual}
                  onChange={(e) => setIptuAnnual(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsFinancing}
                    onChange={(e) => setAcceptsFinancing(e.target.checked)}
                    className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-[#d8c68e]">Accepts Financing</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsExchange}
                    onChange={(e) => setAcceptsExchange(e.target.checked)}
                    className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-[#d8c68e]">Accepts Exchange</span>
                </label>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#B87333] mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Location
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Country *
                </label>
                <input
                  required
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  State/Region *
                </label>
                <input
                  required
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  City *
                </label>
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Neighborhood
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address (optional for privacy)"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Dimensions */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#B87333] mb-6 flex items-center gap-2">
              <Ruler className="w-6 h-6" />
              Dimensions
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                  Total Area {selectedTypeConfig?.isRural ? '(hectares)' : '(m²)'} *
                </label>
                <input
                  required
                  type="number"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              {selectedTypeConfig?.needsRooms && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                      Built Area (m²)
                    </label>
                    <input
                      type="number"
                      value={builtArea}
                      onChange={(e) => setBuiltArea(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                    />
                  </div>

                  {selectedTypeConfig?.needsLand && (
                    <div>
                      <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                        Land Area (m²)
                      </label>
                      <input
                        type="number"
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Rooms & Features (Urban Properties) */}
          {selectedTypeConfig?.needsRooms && (
            <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#B87333] mb-6">Rooms & Features</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    <BedDouble className="w-4 h-4 inline mr-1" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    min="0"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    <Bath className="w-4 h-4 inline mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    min="0"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Suites
                  </label>
                  <input
                    type="number"
                    value={suites}
                    onChange={(e) => setSuites(e.target.value)}
                    min="0"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    <Car className="w-4 h-4 inline mr-1" />
                    Parking
                  </label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    min="0"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer pt-8">
                    <input
                      type="checkbox"
                      checked={furnished}
                      onChange={(e) => setFurnished(e.target.checked)}
                      className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                    />
                    <span className="text-[#d8c68e]">Furnished</span>
                  </label>
                </div>
              </div>
            </section>
          )}

          {/* Rural Features */}
          {selectedTypeConfig?.needsRural && (
            <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#B87333] mb-6 flex items-center gap-2">
                <Trees className="w-6 h-6" />
                Rural Features
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    <Droplet className="w-4 h-4 inline mr-1" />
                    Water Source
                  </label>
                  <select
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="river">River</option>
                    <option value="well">Well</option>
                    <option value="lake">Lake</option>
                    <option value="reservoir">Reservoir</option>
                    <option value="public">Public Water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Soil Quality
                  </label>
                  <select
                    value={soilQuality}
                    onChange={(e) => setSoilQuality(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Topography
                  </label>
                  <select
                    value={topography}
                    onChange={(e) => setTopography(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="flat">Flat</option>
                    <option value="hilly">Hilly</option>
                    <option value="mountainous">Mountainous</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Vegetation Type
                  </label>
                  <input
                    type="text"
                    value={vegetationType}
                    onChange={(e) => setVegetationType(e.target.value)}
                    placeholder="e.g., Forest, Pasture, Crops"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasElectricity}
                      onChange={(e) => setHasElectricity(e.target.checked)}
                      className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                    />
                    <span className="text-[#d8c68e] flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Has Electricity
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInternet}
                      onChange={(e) => setHasInternet(e.target.checked)}
                      className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                    />
                    <span className="text-[#d8c68e] flex items-center gap-1">
                      <Wifi className="w-4 h-4" />
                      Has Internet
                    </span>
                  </label>
                </div>

                {selectedTypeConfig?.needsWater && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer pt-3">
                        <input
                          type="checkbox"
                          checked={nearWater}
                          onChange={(e) => setNearWater(e.target.checked)}
                          className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                        />
                        <span className="text-[#d8c68e] flex items-center gap-1">
                          <Waves className="w-4 h-4" />
                          Near Water (River/Sea)
                        </span>
                      </label>
                      {nearWater && (
                        <input
                          type="number"
                          value={waterDistance}
                          onChange={(e) => setWaterDistance(e.target.value)}
                          placeholder="Distance in meters"
                          className="mt-2 w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Documents */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#B87333] mb-6">Legal Documents</h2>
            
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDeed}
                  onChange={(e) => setHasDeed(e.target.checked)}
                  className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-[#d8c68e]">Has Deed (Escritura)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRegistration}
                  onChange={(e) => setHasRegistration(e.target.checked)}
                  className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-[#d8c68e]">Has Registration (Matrícula)</span>
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Property'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-[#2a2a1a] hover:border-[#B87333] text-[#d8c68e] font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-sm text-[#676767] text-center">
            Your property will be reviewed by our team before being published. This usually takes 24-48 hours.
          </p>
        </form>
      </div>
    </main>
  );
}
