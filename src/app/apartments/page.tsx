"use client";

import { useState } from 'react';
import { useUserApartment } from '@/hooks/useUserApartment';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { useAuth } from '@/lib/useAuth';
import AvailabilityForm from '@/components/AvailabilityForm';
import type { AvailabilityFormData } from '@/types/apartment';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  MapPin,
  Clock,
  Users,
  Heart,
  Calendar,
} from "lucide-react";

export default function ApartmentsPage() {
  const { user } = useAuth();
  const { userApartment, loading: userLoading } = useUserApartment();
  const {
    slots,
    createAvailabilitySlot,
    deleteAvailabilitySlot,
  } = useAvailabilityManagement();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAvailability = async (availabilityData: AvailabilityFormData) => {
    if (!user || !userApartment) return;
    
    await createAvailabilitySlot(
      {
        ...availabilityData,
        apartmentId: userApartment.id,
      },
      user.uid,
      user.displayName || user.email?.split('@')[0] || 'Anonymous',
      user.email || ''
    );
    setIsPostModalOpen(false);
  };

  const handleDeleteAvailability = async (slotId: string) => {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      await deleteAvailabilitySlot(slotId);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 md:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🏠</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Apartment Hosting</h1>
              </div>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
                Turn your place into the ultimate hangout spot! Connect with friends, host epic gatherings, and discover amazing spaces around campus 🎉
              </p>
            </div>
          </div>
          {/* Floating elements for visual interest */}
          <div className="absolute top-20 right-20 text-6xl opacity-20 animate-bounce pointer-events-none select-none">🎮</div>
          <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-pulse pointer-events-none select-none">☕</div>
          <div className="absolute top-40 left-1/3 text-5xl opacity-20 animate-bounce delay-1000 pointer-events-none select-none">🍕</div>
        </section>

        {/* Main Content - Centered Column */}
        <section className="max-w-3xl mx-auto w-full px-4 flex flex-col gap-8 py-10 md:py-14">
          {/* Your Space Card - balanced, professional */}
          <Card className="border border-slate-200 shadow-md rounded-xl bg-white/95 w-full max-w-xl mx-auto p-4 mb-6">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-2">🏡</div>
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900">Your Space</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Your home base</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full text-xs">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-1">
              {userApartment ? (
                <div>
                  <h3 className="font-semibold text-slate-900 text-base mb-0.5 truncate">{userApartment.name}</h3>
                  <p className="text-sm text-slate-600 mb-0.5 truncate">{userApartment.description || "The ultimate hangout spot for AAConnect members ✨"}</p>
                  <div className="flex items-center text-slate-400 mb-0 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userApartment.address || "123 Campus Drive"}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 flex items-start">
                  <div className="mr-2 text-amber-500 text-lg">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-0.5 text-sm">No Space Registered</h3>
                    <p className="text-xs text-amber-700 mb-1">Ready to become a host? Register your apartment!</p>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs px-2 py-1">
                      🏠 Register
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end items-center gap-2 bg-transparent pt-0 pb-1">
              {userApartment ? (
                <>
                  <Button
                    variant="outline"
                    className="h-10 px-4 text-sm font-semibold border-2 border-slate-300 hover:bg-slate-100 bg-white text-slate-700 flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">✏️</span> Edit
                  </Button>
                  <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="h-10 px-5 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl flex items-center gap-2 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        style={{ boxShadow: '0 2px 12px 0 rgba(80, 63, 205, 0.10)' }}
                      >
                        + Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                      <DialogHeader className="w-full">
                        <DialogTitle className="text-lg font-bold text-slate-900 mb-2 text-center w-full">Post Availability</DialogTitle>
                      </DialogHeader>
                      <AvailabilityForm
                        onSubmit={async (data) => {
                          setIsLoading(true);
                          await handleCreateAvailability(data);
                          setIsLoading(false);
                          setIsPostModalOpen(false);
                          toast({
                            title: '✅ Posted successfully!',
                            description: 'Your hangout is now live. Time to get social!',
                            variant: 'default',
                          });
                        }}
                        loading={isLoading}
                        apartmentId={userApartment.id}
                        apartmentName={userApartment.name}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              ) : null}
            </CardFooter>
          </Card>

          {/* Main Content - What&apos;s Happening */}
          <section className="py-0 bg-white">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                <span className="text-4xl mr-2">🔥</span>
                What&apos;s Happening
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Discover amazing hangout spots and connect with your community. From study sessions to game nights, there&apos;s always something going on!
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 bg-white shadow-sm border border-slate-200">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-700 font-semibold transition-colors"
                >
                  🌟 All Events
                </TabsTrigger>
                <TabsTrigger
                  value="mine"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-700 font-semibold transition-colors"
                >
                  🏡 My Posts
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-700 font-semibold transition-colors"
                >
                  ❤️ Saved
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {slots.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-900">{slots.length}</span> hangout spots
                        found
                      </p>
                    </div>

                    {slots.map((slot) => (
                      <Card
                        key={slot.id}
                        className="border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white overflow-hidden group"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="h-12 w-12 border-2 border-slate-200 group-hover:border-blue-300 transition-colors rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white flex items-center justify-center font-semibold text-lg">
                                {slot.postedByName?.charAt(0) || '?'}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-bold text-lg text-slate-900">{slot.apartmentName}</h3>
                                  <Badge className="bg-blue-100 text-blue-800 border-0">
                                    😌 chill
                                  </Badge>
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                    Upcoming
                                  </Badge>
                                </div>

                                <p className="text-slate-700 mb-3 text-base">{slot.description || "Come hang out and enjoy snacks and play games! 🎮🍕"}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                    <span className="font-medium">
                                      {slot.startTime.toDate().toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-purple-500" />
                                    <span>
                                      {slot.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-green-500" />
                                    <span>
                                      0/{slot.maxGuests || 8} people
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  {slot.tags && slot.tags.length > 0 && slot.tags.map((tag) => {
                                    const tagMap = {
                                      snacks: { icon: '🍿', label: 'snacks' },
                                      games: { icon: '🎲', label: 'games' },
                                      study: { icon: '📚', label: 'study' },
                                      yap: { icon: '🗣️', label: 'yap' },
                                      quiet: { icon: '🤫', label: 'quiet' },
                                      prayer: { icon: '🙏', label: 'prayer' },
                                      jam: { icon: '🎸', label: 'jam sesh' },
                                    };
                                    const tagInfo = (tag in tagMap)
                                      ? tagMap[tag as keyof typeof tagMap]
                                      : { icon: '🏠', label: tag };
                                    return (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1"
                                      >
                                        <span>{tagInfo.icon}</span> {tagInfo.label}
                                      </Badge>
                                    );
                                  })}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-slate-500">
                                    <span>
                                      Posted by {slot.postedByName || 'Anonymous'} • {slot.createdAt.toDate().toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-colors border-pink-200 text-pink-600 hover:bg-pink-50"
                                      disabled
                                    >
                                      <Heart className="h-4 w-4" />
                                      Interested
                                    </Button>
                                    {slot.postedBy === user?.uid && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => handleDeleteAvailability(slot.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {slot.postedBy !== user?.uid && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                                🎉 Join This Hangout
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">😴</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Pretty quiet around here...</h3>
                    <p className="text-slate-500 mb-6">Be the first to post a hangout and get the party started!</p>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      🚀 Create First Hangout
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mine">
                <div className="space-y-4">
                  {slots
                    .filter((slot) => slot.postedBy === user?.uid)
                    .map((slot) => (
                      <Card
                        key={slot.id}
                        className="border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-bold text-lg text-slate-900">{slot.apartmentName}</h3>
                                <Badge className="bg-blue-100 text-blue-800 border-0">
                                  😌 chill
                                </Badge>
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                  Live
                                </Badge>
                              </div>

                              <p className="text-slate-700 mb-3">{slot.description || "Come hang out and enjoy snacks and play games! 🎮🍕"}</p>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                  <span>{slot.startTime.toDate().toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-purple-500" />
                                  <span>
                                    {slot.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1 text-green-500" />
                                  <span>
                                    0/{slot.maxGuests || 8} people
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500">
                                  Posted {slot.createdAt.toDate().toLocaleDateString()}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:bg-red-50"
                                  onClick={() => handleDeleteAvailability(slot.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💾</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No saved hangouts yet</h3>
                  <p className="text-slate-500 mb-6">Start exploring and save the ones that catch your eye!</p>
                  <Button variant="outline" className="hover:bg-slate-50 bg-transparent">
                    🔍 Browse All Events
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </section>
      </main>
      <Toaster />
    </div>
  );
} 