"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  GraduationCap,
  School,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Shield,
  BookOpen,
  FileCheck,
  Globe,
  Calendar,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const stats = useQuery(api.statistics.getPublicStats);
  const latestNews = useQuery(api.news.listPublic, { limit: 3 });
  const upcomingEvents = useQuery(api.events.listPublic, { limit: 4 });

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Shield size={16} />
            Official Education Board
          </div>
          <h1>
            Education Board for Registration &amp; Results
          </h1>
          <p>
            Uniting community-based schools under one structured academic
            authority. Establishing standardized curriculum, transparent
            examinations, and certified academic recognition for every student.
          </p>
          <div className="hero-actions">
            <Link href="/results" className="btn btn-primary btn-lg">
              <FileCheck size={18} />
              View Results
            </Link>
            <Link href="/schools" className="btn btn-outline btn-lg">
              <School size={18} />
              Affiliated Schools
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <School size={26} />
              </div>
              <div className="stat-value">{stats?.totalSchools ?? "—"}</div>
              <div className="stat-label">Affiliated Schools</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={26} />
              </div>
              <div className="stat-value">{stats?.totalStudents ?? "—"}</div>
              <div className="stat-label">Registered Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={26} />
              </div>
              <div className="stat-value">{stats?.totalExams ?? "—"}</div>
              <div className="stat-label">Exams Conducted</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={26} />
              </div>
              <div className="stat-value">
                {stats?.passRate ? `${stats.passRate}%` : "—"}
              </div>
              <div className="stat-label">Pass Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Statement */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-tag">Our Commitment</span>
              <h2>Transparency &amp; Academic Integrity</h2>
              <p>
                EBRR operates with full transparency in governance, examination
                processes, and result publication. Every result is verified,
                every certificate traceable, and every decision is documented.
              </p>
              <p>
                Our mission is to provide structured academic documentation
                and credibility for students, ensuring their educational
                journey is recorded, recognized, and respected.
              </p>
              <Link href="/about" className="btn btn-outline" style={{ marginTop: "8px" }}>
                Learn More About EBRR
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="value-cards">
              <div className="value-card">
                <h4>
                  <Shield size={18} color="var(--color-primary-700)" />
                  Governance
                </h4>
                <p>
                  Structured board governance with clear policies and
                  accountability.
                </p>
              </div>
              <div className="value-card">
                <h4>
                  <FileCheck size={18} color="var(--color-accent-600)" />
                  Verified Results
                </h4>
                <p>
                  Every result is reviewed and approved before publication.
                </p>
              </div>
              <div className="value-card">
                <h4>
                  <Award size={18} color="var(--color-gold-500)" />
                  Certification
                </h4>
                <p>
                  Traceable certificates with QR verification codes.
                </p>
              </div>
              <div className="value-card">
                <h4>
                  <Globe size={18} color="var(--color-primary-500)" />
                  Accessibility
                </h4>
                <p>
                  Designed for low-bandwidth access and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Stay Informed</span>
            <h2>Latest News &amp; Announcements</h2>
            <p>
              Official circulars, policy updates, and examination notices from
              the Education Board.
            </p>
          </div>

          {latestNews && latestNews.length > 0 ? (
            <div className="grid-3">
              {latestNews.map((item) => (
                <div key={item._id} className="news-card">
                  <div className="news-card-body">
                    <span
                      className={`category-badge badge-${item.category}`}
                    >
                      {item.isUrgent && "🔴 "}
                      {item.category}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.content.substring(0, 150)}...</p>
                    <div className="meta">
                      <span>
                        <Calendar size={14} />
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString()
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No announcements yet</h3>
              <p>Check back soon for the latest news and circulars.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/news" className="btn btn-outline">
              View All News
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Schedule</span>
            <h2>Upcoming Events</h2>
            <p>
              Examination schedules, academic calendar, and important deadlines.
            </p>
          </div>

          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
              {upcomingEvents.map((event) => {
                const d = new Date(event.date);
                return (
                  <div key={event._id} className="event-card">
                    <div className="event-date-box">
                      <div className="month">
                        {d.toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="day">{d.getDate()}</div>
                    </div>
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p>{event.description.substring(0, 80)}</p>
                      <span
                        className="event-type-badge"
                        style={{
                          background: "var(--color-primary-50)",
                          color: "var(--color-primary-700)",
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No events scheduled</h3>
              <p>Events and examination dates will appear here.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/events" className="btn btn-outline">
              Full Calendar
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent-700), var(--color-primary-800))",
          padding: "64px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <h2 style={{ color: "white", marginBottom: "16px" }}>
            Verify Your Results &amp; Certificates
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              marginBottom: "32px",
              maxWidth: "500px",
              margin: "0 auto 32px",
            }}
          >
            Search for published examination results or verify the
            authenticity of a certificate using its unique verification code.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/results"
              className="btn btn-lg"
              style={{ background: "white", color: "var(--color-primary-900)" }}
            >
              <FileCheck size={18} />
              Search Results
            </Link>
            <Link
              href="/verify"
              className="btn btn-outline btn-lg"
              style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Award size={18} />
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
