import { useState, useMemo } from "react";
import { useCalendarStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock } from "lucide-react";

type View = "month" | "week" | "day";

export default function CalendarPage() {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState("");
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const events = useCalendarStore((state) => state.events);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      addEvent({
        title: newEventTitle,
        startTime: currentDate,
        endTime: new Date(currentDate.getTime() + 3600000),
      });
      setNewEventTitle("");
      setShowNewEventForm(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(
      (e) => e.startTime.toDateString() === date.toDateString()
    );
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 w-full">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="px-4 md:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Calendar</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-all"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <button
              onClick={() => setShowNewEventForm(!showNewEventForm)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" /> Event
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {showNewEventForm && (
          <div className="glass rounded-lg p-4 md:p-6 mb-6 glow-border">
            <h3 className="text-lg font-semibold mb-4">New Event</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all"
              />
              <input
                type="date"
                value={currentDate.toISOString().split("T")[0]}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all font-medium"
                >
                  Add Event
                </button>
                <button
                  onClick={() => setShowNewEventForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "month" && (
          <div>
            {/* Month Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl md:text-2xl font-bold">{monthName}</h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="glass rounded-lg p-2 md:p-6 overflow-x-auto">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4 min-w-[500px]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs md:text-sm font-semibold text-foreground/70 py-1 md:py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 min-w-[500px]">
                {monthDays.map((date, idx) => {
                  const dateEvents = getEventsForDate(date);
                  const isToday =
                    date && date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={idx}
                      className={`min-h-[80px] md:min-h-[96px] p-1 md:p-2 rounded-lg border ${
                        date
                          ? isToday
                            ? "bg-primary/20 border-primary/50"
                            : "bg-white/5 border-white/10"
                          : "bg-transparent border-transparent"
                      } hover:bg-white/10 transition-all cursor-pointer`}
                    >
                      {date && (
                        <>
                          <p className="text-xs md:text-sm font-semibold mb-1">
                            {date.getDate()}
                          </p>
                          <div className="space-y-1">
                            {dateEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className="text-[10px] md:text-xs bg-primary/30 text-primary px-1 md:px-1.5 py-0.5 rounded truncate hover:bg-primary/50 group relative"
                              >
                                {event.title}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteEvent(event.id);
                                  }}
                                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 md:hidden sm:group-hover:block"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            {dateEvents.length > 2 && (
                              <p className="text-[10px] md:text-xs text-foreground/60 px-1">
                                +{dateEvents.length - 2} more
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Week View</h3>
            {events.length === 0 ? (
              <p className="text-foreground/60">No events scheduled</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="glass rounded-lg p-3 md:p-4 flex items-center justify-between group hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm md:text-base">{event.title}</p>
                        <p className="text-xs md:text-sm text-foreground/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          {event.startTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "day" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {currentDate.toLocaleDateString()}
            </h3>
            {getEventsForDate(currentDate).length === 0 ? (
              <p className="text-foreground/60">No events scheduled for this day</p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(currentDate).map((event) => (
                  <div
                    key={event.id}
                    className="glass rounded-lg p-3 md:p-4 flex items-center justify-between group hover:bg-white/10 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-sm md:text-base">{event.title}</p>
                      <p className="text-xs md:text-sm text-foreground/60">
                        {event.startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {event.endTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
