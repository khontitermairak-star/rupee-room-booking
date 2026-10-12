import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient";

/* ---------------------------------------------------------
   ห้องเอนกประสงค์คณะรัฐศาสตร์และนิติศาสตร์ ม.บูรพา — ระบบจองที่นั่ง (v2)
--------------------------------------------------------- */
const ITEMS = [
  { id: "sofa-3", label: "โซฟาเล็ก", num: "3", type: "sofa", c: [1, 3], r: [4, 6] },
  { id: "sofa-2", label: "โซฟาเล็ก", num: "2", type: "sofa", c: [1, 3], r: [6, 8] },
  { id: "sofa-1", label: "โซฟาเล็ก", num: "1", type: "sofa", c: [1, 3], r: [8, 10] },
  { id: "sofa-4", label: "โซฟาเล็ก", num: "4", type: "sofa", c: [3, 4], r: [11, 12] },
  { id: "sofa-big", label: "โซฟาใหญ่", num: "", type: "sofa", c: [1, 4], r: [13, 15] },

  { id: "round-8", label: "โต๊ะกลม", num: "8", type: "round", c: [4, 5], r: [3, 4] },
  { id: "round-7", label: "โต๊ะกลม", num: "7", type: "round", c: [4, 5], r: [4, 5] },
  { id: "round-6", label: "โต๊ะกลม", num: "6", type: "round", c: [4, 5], r: [5, 6] },
  { id: "round-5", label: "โต๊ะกลม", num: "5", type: "round", c: [4, 5], r: [6, 7] },
  { id: "round-4", label: "โต๊ะกลม", num: "4", type: "round", c: [4, 5], r: [7, 8] },
  { id: "round-3", label: "โต๊ะกลม", num: "3", type: "round", c: [4, 5], r: [8, 9] },
  { id: "round-2", label: "โต๊ะกลม", num: "2", type: "round", c: [4, 5], r: [9, 10] },
  { id: "round-1", label: "โต๊ะกลม", num: "1", type: "round", c: [4, 5], r: [10, 11] },

  { id: "small-9", label: "โต๊ะเล็ก", num: "9", type: "small", c: [5, 6], r: [4, 5] },
  { id: "small-10", label: "โต๊ะเล็ก", num: "10", type: "small", c: [6, 7], r: [4, 5] },
  { id: "small-7", label: "โต๊ะเล็ก", num: "7", type: "small", c: [5, 6], r: [5, 6] },
  { id: "small-8", label: "โต๊ะเล็ก", num: "8", type: "small", c: [6, 7], r: [5, 6] },
  { id: "small-5", label: "โต๊ะเล็ก", num: "5", type: "small", c: [5, 6], r: [6, 7] },
  { id: "small-6", label: "โต๊ะเล็ก", num: "6", type: "small", c: [6, 7], r: [6, 7] },
  { id: "small-3", label: "โต๊ะเล็ก", num: "3", type: "small", c: [5, 6], r: [7, 8] },
  { id: "small-4", label: "โต๊ะเล็ก", num: "4", type: "small", c: [6, 7], r: [7, 8] },
  { id: "small-2", label: "โต๊ะเล็ก", num: "2", type: "small", c: [5, 6], r: [10, 11] },
  { id: "small-1", label: "โต๊ะเล็ก", num: "1", type: "small", c: [5, 6], r: [11, 12] },
  { id: "small-11", label: "โต๊ะเล็ก", num: "11", type: "small", c: [8, 9], r: [9, 10] },
  { id: "small-12", label: "โต๊ะเล็ก", num: "12", type: "small", c: [9, 10], r: [9, 10] },
  { id: "small-13", label: "โต๊ะเล็ก", num: "13", type: "small", c: [10, 11], r: [9, 10] },

  { id: "middle-2", label: "โต๊ะกลาง", num: "2", type: "middle", c: [8, 9], r: [5, 7] },
  { id: "middle-1", label: "โต๊ะกลาง", num: "1", type: "middle", c: [8, 9], r: [7, 9] },

  { id: "big-2", label: "โต๊ะใหญ่", num: "2", type: "big", c: [10, 12], r: [1, 4] },
  { id: "big-1", label: "โต๊ะใหญ่", num: "1", type: "big", c: [7, 9], r: [13, 15] },

  { id: "bar-14", label: "บาร์", num: "14", type: "bar", c: [13, 14], r: [1, 2] },
  { id: "bar-13", label: "บาร์", num: "13", type: "bar", c: [13, 14], r: [2, 3] },
  { id: "bar-12", label: "บาร์", num: "12", type: "bar", c: [13, 14], r: [3, 4] },
  { id: "bar-11", label: "บาร์", num: "11", type: "bar", c: [13, 14], r: [4, 5] },
  { id: "bar-10", label: "บาร์", num: "10", type: "bar", c: [13, 14], r: [5, 6] },
  { id: "bar-9", label: "บาร์", num: "9", type: "bar", c: [13, 14], r: [6, 7] },
  { id: "bar-8", label: "บาร์", num: "8", type: "bar", c: [13, 14], r: [7, 8] },
  { id: "bar-7", label: "บาร์", num: "7", type: "bar", c: [13, 14], r: [8, 9] },
  { id: "bar-6", label: "บาร์", num: "6", type: "bar", c: [13, 14], r: [9, 10] },
  { id: "bar-5", label: "บาร์", num: "5", type: "bar", c: [13, 14], r: [10, 11] },
  { id: "bar-4", label: "บาร์", num: "4", type: "bar", c: [13, 14], r: [11, 12] },
  { id: "bar-3", label: "บาร์", num: "3", type: "bar", c: [13, 14], r: [12, 13] },
  { id: "bar-1", label: "บาร์", num: "1", type: "bar", c: [10, 11], r: [11, 12] },
  { id: "bar-2", label: "บาร์", num: "2", type: "bar", c: [11, 12], r: [11, 12] },
];

const LANDMARKS = [
  { id: "lm-room", label: "ห้องโสมสรนิสิต", c: [2, 9], r: [1, 2] },
  { id: "lm-bath", label: "ห้องน้ำ", c: [10, 13], r: [12, 15] },
  { id: "lm-door1", label: "ประตู 1", c: [5, 7], r: [15, 16] },
  { id: "lm-door2", label: "ประตู 2", c: [13, 14], r: [13, 15] },
  { id: "lm-door3", label: "ประตู 3", c: [1, 2], r: [1, 3] },
];

const TYPE_TH = { sofa: "โซฟา", round: "โต๊ะกลม", small: "โต๊ะเล็ก", middle: "โต๊ะกลาง", big: "โต๊ะใหญ่", bar: "บาร์" };

const pad = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const toMin = (hm) => {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
};
const overlaps = (aS, aE, bS, bE) => toMin(aS) < toMin(bE) && toMin(bS) < toMin(aE);
const fmtDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
};
const roundedNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  return `${pad(d.getHours() % 24)}:${pad(d.getMinutes())}`;
};
const plusHour = (hm) => {
  let m = toMin(hm) + 60;
  if (m >= 24 * 60) m = 23 * 60 + 59;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

const rowToBooking = (row) => ({
  id: row.id,
  itemId: row.item_id,
  itemLabel: row.item_label,
  itemType: row.item_type,
  date: row.date,
  start: row.start_time,
  end: row.end_time,
  name: row.name,
  code: row.code,
  note: row.note || "",
  createdAt: row.created_at,
});

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [dbOk, setDbOk] = useState(true);
  const [tab, setTab] = useState("map");
  const [now, setNow] = useState(new Date());
  const [bookDate, setBookDate] = useState(todayStr());
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", note: "", start: roundedNow(), end: plusHour(roundedNow()) });
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelCode, setCancelCode] = useState("");
  const [cancelError, setCancelError] = useState("");
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) {
      setDbOk(false);
      return;
    }
    setDbOk(true);
    setBookings((data || []).map(rowToBooking));
  }, []);

  useEffect(() => {
    load();
    const clock = setInterval(() => setNow(new Date()), 15000);
    pollRef.current = setInterval(load, 30000);
    const channel = supabase
      .channel("bookings-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => load())
      .subscribe();
    return () => {
      clearInterval(clock);
      clearInterval(pollRef.current);
      supabase.removeChannel(channel);
    };
  }, [load]);

  const todayNow = todayStr();
  const nowHMs = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const liveBookingFor = useCallback(
    (itemId) =>
      bookings.find(
        (b) => b.itemId === itemId && b.date === todayNow && toMin(b.start) <= toMin(nowHMs) && toMin(nowHMs) < toMin(b.end)
      ),
    [bookings, todayNow, nowHMs]
  );

  const nextBookingFor = useCallback(
    (itemId) => bookings.filter((b) => b.itemId === itemId && b.date === bookDate).sort((a, b) => toMin(a.start) - toMin(b.start)),
    [bookings, bookDate]
  );

  const openItem = (item) => {
    setSelected(item);
    const s = roundedNow();
    setForm({ name: "", code: "", note: "", start: s, end: plusHour(s) });
    setFormError("");
    setCancelingId(null);
  };
  const closeModal = () => {
    setSelected(null);
    setFormError("");
    setCancelingId(null);
    setCancelCode("");
    setCancelError("");
  };

  const submitBooking = async () => {
    if (!selected) return;
    const name = form.name.trim();
    const code = form.code.trim();
    if (!name) return setFormError("กรุณาใส่ชื่อผู้จอง");
    if (!code) return setFormError("กรุณาใส่รหัสนิสิต (ใช้เป็นรหัสผ่านสำหรับยกเลิกภายหลัง)");
    if (toMin(form.end) <= toMin(form.start)) return setFormError("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น");
    const conflict = bookings.find(
      (b) => b.itemId === selected.id && b.date === bookDate && overlaps(form.start, form.end, b.start, b.end)
    );
    if (conflict) return setFormError(`ช่วงเวลานี้ถูกจองแล้วโดย ${conflict.name} (${conflict.start}–${conflict.end})`);

    setBusy(true);
    const itemLabel = `${selected.label}${selected.num ? " " + selected.num : ""}`;
    const { error } = await supabase.from("bookings").insert({
      id: uid(),
      item_id: selected.id,
      item_label: itemLabel,
      item_type: selected.type,
      date: bookDate,
      start_time: form.start,
      end_time: form.end,
      name,
      code,
      note: form.note.trim(),
      created_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      setFormError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
      return;
    }
    await load();
    setToast(`จอง${itemLabel} สำเร็จ`);
    setTimeout(() => setToast(""), 2500);
    closeModal();
  };

  const startCancel = (id) => {
    setCancelingId(id);
    setCancelCode("");
    setCancelError("");
  };

  const confirmCancel = async (booking) => {
    if (!cancelCode.trim()) return setCancelError("กรุณาใส่รหัสนิสิตที่ใช้ตอนจอง");
    if (cancelCode.trim() !== booking.code) return setCancelError("รหัสไม่ถูกต้อง");
    await supabase.from("bookings").delete().eq("id", booking.id);
    await load();
    setCancelingId(null);
    setCancelCode("");
    setToast("ยกเลิกการจองแล้ว");
    setTimeout(() => setToast(""), 2000);
  };

  const clearAll = async () => {
    await supabase.from("bookings").delete().neq("id", "__none__");
    await load();
    setConfirmClear(false);
    setToast("ล้างข้อมูลการจองทั้งหมดแล้ว");
    setTimeout(() => setToast(""), 2000);
  };

  const stats = useMemo(() => {
    const byName = {};
    const byItem = {};
    bookings.forEach((b) => {
      const n = b.name.trim();
      byName[n] = (byName[n] || 0) + 1;
      byItem[b.itemLabel] = (byItem[b.itemLabel] || 0) + 1;
    });
    const topNames = Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const topItems = Object.entries(byItem).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const recent = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 20);
    const todayCount = bookings.filter((b) => b.date === todayNow).length;
    return {
      total: bookings.length,
      uniqueUsers: Object.keys(byName).length,
      todayCount,
      topNames,
      topItems,
      recent,
      maxName: topNames.length ? topNames[0][1] : 1,
      maxItem: topItems.length ? topItems[0][1] : 1,
    };
  }, [bookings, todayNow]);

  const liveFreeCount = ITEMS.length - ITEMS.filter((it) => liveBookingFor(it.id)).length;

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        :root{
          --bg:#FBF7EE; --panel:#FFFFFF; --panel2:#F4EEDF; --line: rgba(60,50,30,0.14);
          --ink:#2E2A22; --muted:#8C8170; --brass:#A97C22; --brass-bright:#C79A46;
          --green:#4C8B5A; --green-text:#356B41; --green-bg: rgba(76,139,90,0.10);
          --red:#B23A2E; --red-text:#9C2F24; --red-bg: rgba(178,58,46,0.10);
        }
        *{box-sizing:border-box;}
        html{color-scheme:light;}
        body{margin:0;}
        .app{ font-family:'Noto Sans Thai', sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; padding-bottom:40px; }
        .mono{font-family:'IBM Plex Mono', monospace;}
        .serif{font-family:'Noto Serif Thai', serif;}
        .topbar{ position:sticky; top:0; z-index:20; background:rgba(251,247,238,0.96);
          border-bottom:1px solid var(--line); backdrop-filter:blur(6px); padding:14px 16px 12px; }
        .topbar-title{ font-family:'Noto Serif Thai', serif; font-weight:700; font-size:19px; color:var(--ink);
          display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; }
        .clock{ font-family:'IBM Plex Mono', monospace; font-size:12px; color:var(--brass);
          margin-top:6px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
        .dot.g{background:var(--green);} .dot.r{background:var(--red);}
        .tabs{display:flex; gap:6px; margin-top:12px;}
        .tab-btn{ flex:1; font-family:'Noto Sans Thai'; font-weight:600; font-size:13px; padding:9px 6px;
          border-radius:9px; border:1px solid var(--line); background:var(--panel); color:var(--muted); cursor:pointer; }
        .tab-btn.active{ background:var(--panel2); color:var(--brass); border-color:var(--brass); }
        .toolbar{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; padding:12px 16px 4px; }
        .field-label{font-size:11px; color:var(--muted); display:block; margin-bottom:4px;}
        input[type=date], input[type=time], input[type=text]{ background:var(--panel); border:1px solid var(--line);
          color:var(--ink); border-radius:8px; padding:8px 10px; font-family:'IBM Plex Mono', monospace; font-size:13px; }
        input[type=text]{font-family:'Noto Sans Thai'; font-size:14px;}
        input:focus{outline:2px solid var(--brass); outline-offset:1px;}
        .legend{ display:flex; gap:16px; padding:8px 16px 2px; font-size:12px; color:var(--muted); flex-wrap:wrap; }
        .legend span{display:flex; align-items:center; gap:6px;}
        .sw{width:12px;height:12px;border-radius:3px;display:inline-block;}
        .sw.g{background:var(--green);} .sw.r{background:var(--red);}
        .plan-wrap{ overflow-x:auto; -webkit-overflow-scrolling:touch; padding:14px 16px 24px; }
        .plan{ display:grid; grid-template-columns: repeat(13, minmax(58px, 1fr)); grid-auto-rows: minmax(46px, auto);
          gap:8px; min-width:900px; background:var(--panel); padding:10px; border:1px solid var(--line); border-radius:16px; }
        .landmark{ display:flex; align-items:center; justify-content:center; text-align:center; border:1px dashed var(--line);
          border-radius:10px; color:var(--muted); font-size:12px; padding:4px; background:var(--panel2); }
        .tile{ border-radius:10px; border:1.5px solid var(--green); background:var(--green-bg); color:var(--green-text);
          display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer;
          padding:2px 3px; text-align:center; transition:transform .12s ease; position:relative; user-select:none; }
        .tile:active{transform:scale(0.94);}
        .tile .name{font-size:10.5px; line-height:1.15; font-weight:600;}
        .tile .num{font-family:'IBM Plex Mono'; font-size:13px; font-weight:600;}
        .tile .tag{font-size:9px; font-family:'IBM Plex Mono'; opacity:.85; margin-top:1px;}
        .tile.type-round{border-radius:50%;} .tile.type-sofa{border-radius:20px;} .tile.type-bar{border-radius:6px;}
        .tile.booked{ border-color:var(--red); background:var(--red-bg); color:var(--red-text); }
        .list-view{padding:10px 16px 24px;}
        .group-title{ font-family:'Noto Serif Thai'; color:var(--brass); font-size:14px; font-weight:600;
          margin:16px 0 8px; padding-bottom:6px; border-bottom:1px solid var(--line); }
        .row-item{ display:flex; align-items:center; justify-content:space-between; background:var(--panel);
          border:1px solid var(--line); border-radius:10px; padding:10px 12px; margin-bottom:7px; cursor:pointer; }
        .row-item .l{display:flex; flex-direction:column;}
        .row-item .l b{font-size:14px;}
        .row-item .l small{color:var(--muted); font-size:11.5px; font-family:'IBM Plex Mono';}
        .badge{ font-size:11px; font-family:'IBM Plex Mono'; font-weight:600; padding:4px 9px; border-radius:20px; border:1px solid; }
        .badge.g{color:var(--green-text); border-color:var(--green); background:var(--green-bg);}
        .badge.r{color:var(--red-text); border-color:var(--red); background:var(--red-bg);}
        .modal-overlay{ position:fixed; inset:0; background:rgba(40,34,22,0.35); display:flex; align-items:flex-end; justify-content:center; z-index:50; }
        @media (min-width:640px){ .modal-overlay{align-items:center;} }
        .modal{ background:var(--panel); border:1px solid var(--line); border-radius:18px 18px 0 0; width:100%;
          max-width:440px; max-height:88vh; overflow-y:auto; padding:20px 20px 24px; box-shadow:0 12px 40px rgba(40,34,22,0.18); }
        @media (min-width:640px){ .modal{border-radius:16px;} }
        .modal h3{ font-family:'Noto Serif Thai'; color:var(--ink); font-size:19px; margin:0 0 3px; }
        .modal .sub{color:var(--muted); font-size:12px; margin-bottom:14px; font-family:'IBM Plex Mono';}
        .grid2{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
        .full{width:100%;}
        .modal label{display:block; margin-top:12px;}
        .hint{font-size:11px; color:var(--muted); margin-top:3px;}
        .err{ color:var(--red-text); font-size:12.5px; margin-top:10px; background:var(--red-bg);
          border:1px solid var(--red); border-radius:8px; padding:8px 10px; }
        .existing-list{margin-top:12px; padding-top:10px; border-top:1px solid var(--line);}
        .existing-list .h{font-size:11.5px; color:var(--muted); margin-bottom:6px;}
        .exist-row{ padding:8px 0; border-bottom:1px dashed var(--line); font-size:12.5px; }
        .exist-row:last-child{border-bottom:none;}
        .exist-row-top{display:flex; justify-content:space-between; align-items:center;}
        .exist-row-top button{ background:none; border:1px solid var(--red); color:var(--red-text);
          border-radius:7px; font-size:11px; padding:3px 8px; cursor:pointer; }
        .cancel-inline{display:flex; gap:6px; margin-top:8px; align-items:flex-start; flex-wrap:wrap;}
        .cancel-inline input{flex:1; min-width:120px;}
        .cancel-inline button{ border-radius:7px; border:none; font-size:11.5px; padding:6px 10px; cursor:pointer; font-weight:600; }
        .cancel-inline .go{background:var(--red); color:#fff;}
        .cancel-inline .no{background:transparent; border:1px solid var(--line); color:var(--muted);}
        .btn{ width:100%; padding:12px; border-radius:10px; border:none; cursor:pointer;
          font-family:'Noto Sans Thai'; font-weight:700; font-size:14.5px; margin-top:16px; }
        .btn.primary{background:var(--brass); color:#fff;}
        .btn.primary:disabled{opacity:.5;}
        .btn.ghost{background:transparent; border:1px solid var(--line); color:var(--muted); margin-top:8px;}
        .stats-wrap{padding:14px 16px 30px;}
        .cards{display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:18px;}
        .card{ background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:12px 10px; text-align:center; }
        .card b{display:block; font-family:'IBM Plex Mono'; font-size:22px; color:var(--brass);}
        .card span{font-size:10.5px; color:var(--muted);}
        .bars{margin-bottom:20px;}
        .bar-row{margin-bottom:9px;}
        .bar-row .lbl{display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:3px;}
        .bar-track{height:8px; background:var(--panel2); border-radius:5px; overflow:hidden; border:1px solid var(--line);}
        .bar-fill{height:100%; background:var(--brass); border-radius:5px;}
        table.history{width:100%; border-collapse:collapse; font-size:12px;}
        table.history th{ text-align:left; color:var(--muted); font-weight:600; font-size:10.5px;
          border-bottom:1px solid var(--line); padding:6px 4px; font-family:'IBM Plex Mono'; }
        table.history td{padding:7px 4px; border-bottom:1px dashed var(--line);}
        .empty{color:var(--muted); font-size:12.5px; text-align:center; padding:20px 0;}
        .clear-link{ background:none; border:none; color:var(--muted); font-size:11px; text-decoration:underline;
          cursor:pointer; margin-top:20px; }
        .toast{ position:fixed; bottom:18px; left:50%; transform:translateX(-50%); background:var(--brass);
          color:#fff; font-weight:600; font-size:13px; padding:9px 18px; border-radius:30px; z-index:60;
          box-shadow:0 4px 18px rgba(40,34,22,0.25); }
        .offline-banner{ background:var(--red-bg); border:1px solid var(--red); color:var(--red-text);
          font-size:11.5px; padding:7px 16px; text-align:center; }
      `}</style>

      {!dbOk && (
        <div className="offline-banner">
          เชื่อมต่อฐานข้อมูลไม่สำเร็จ — ตรวจสอบค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY และตาราง bookings ใน Supabase
        </div>
      )}

      <div className="topbar">
        <div className="topbar-title">
          <span className="serif">ระบบจองที่นั่ง</span>
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
            ห้องเอนกประสงค์ คณะรัฐศาสตร์และนิติศาสตร์ ม.บูรพา
          </span>
        </div>
        <div className="clock">
          <span>{fmtDate(todayNow)} · {nowHMs} น.</span>
          <span>·</span>
          <span><span className="dot g" /> ว่าง {liveFreeCount}/{ITEMS.length}</span>
          <span><span className="dot r" /> ไม่ว่างตอนนี้ {ITEMS.length - liveFreeCount}</span>
        </div>
        <div className="tabs">
          <button className={`tab-btn ${tab === "map" ? "active" : ""}`} onClick={() => setTab("map")}>ผังที่นั่ง</button>
          <button className={`tab-btn ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>รายการจอง</button>
          <button className={`tab-btn ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>สถิติ</button>
        </div>
      </div>

      {(tab === "map" || tab === "list") && (
        <>
          <div className="toolbar">
            <div>
              <span className="field-label">วันที่ต้องการจอง</span>
              <input type="date" min={todayStr()} value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            </div>
          </div>
          <div className="legend">
            <span><span className="sw g" /> ว่าง (สถานะปัจจุบัน)</span>
            <span><span className="sw r" /> ไม่ว่าง (มีผู้ใช้งานอยู่ตอนนี้)</span>
          </div>
        </>
      )}

      {tab === "map" && (
        <div className="plan-wrap">
          <div className="plan">
            {LANDMARKS.map((lm) => (
              <div key={lm.id} className="landmark" style={{ gridColumn: `${lm.c[0]} / ${lm.c[1]}`, gridRow: `${lm.r[0]} / ${lm.r[1]}` }}>
                {lm.label}
              </div>
            ))}
            {ITEMS.map((it) => {
              const booked = !!liveBookingFor(it.id);
              return (
                <button key={it.id} className={`tile type-${it.type} ${booked ? "booked" : ""}`}
                  style={{ gridColumn: `${it.c[0]} / ${it.c[1]}`, gridRow: `${it.r[0]} / ${it.r[1]}` }}
                  onClick={() => openItem(it)}>
                  <span className="name">{it.label}</span>
                  {it.num && <span className="num">{it.num}</span>}
                  <span className="tag">{booked ? "ไม่ว่าง" : "ว่าง"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "list" && (
        <div className="list-view">
          {["sofa", "round", "small", "middle", "big", "bar"].map((ty) => (
            <div key={ty}>
              <div className="group-title">{TYPE_TH[ty]}</div>
              {ITEMS.filter((i) => i.type === ty).map((it) => {
                const booked = !!liveBookingFor(it.id);
                const upcoming = nextBookingFor(it.id).length;
                return (
                  <div className="row-item" key={it.id} onClick={() => openItem(it)}>
                    <div className="l">
                      <b>{it.label} {it.num}</b>
                      <small>{upcoming > 0 ? `${upcoming} รายการจองในวันที่เลือก` : "ยังไม่มีการจองในวันที่เลือก"}</small>
                    </div>
                    <span className={`badge ${booked ? "r" : "g"}`}>{booked ? "ไม่ว่าง" : "ว่าง"}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {tab === "stats" && (
        <div className="stats-wrap">
          <div className="cards">
            <div className="card"><b>{stats.total}</b><span>การจองทั้งหมด</span></div>
            <div className="card"><b>{stats.uniqueUsers}</b><span>ผู้ใช้งานทั้งหมด</span></div>
            <div className="card"><b>{stats.todayCount}</b><span>การจองวันนี้</span></div>
          </div>
          <div className="bars">
            <div className="group-title" style={{ marginTop: 0 }}>ผู้ใช้งานบ่อยที่สุด</div>
            {stats.topNames.length === 0 && <div className="empty">ยังไม่มีข้อมูล</div>}
            {stats.topNames.map(([name, count]) => (
              <div className="bar-row" key={name}>
                <div className="lbl"><span>{name}</span><span className="mono">{count}</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / stats.maxName) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="bars">
            <div className="group-title">ที่นั่งยอดนิยม</div>
            {stats.topItems.length === 0 && <div className="empty">ยังไม่มีข้อมูล</div>}
            {stats.topItems.map(([label, count]) => (
              <div className="bar-row" key={label}>
                <div className="lbl"><span>{label}</span><span className="mono">{count}</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / stats.maxItem) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="group-title">ประวัติการจองล่าสุด</div>
          {stats.recent.length === 0 ? (
            <div className="empty">ยังไม่มีประวัติการจอง</div>
          ) : (
            <table className="history">
              <thead><tr><th>ที่นั่ง</th><th>ผู้จอง</th><th>วันที่</th><th>เวลา</th></tr></thead>
              <tbody>
                {stats.recent.map((b) => (
                  <tr key={b.id}>
                    <td>{b.itemLabel}</td>
                    <td>{b.name}</td>
                    <td className="mono">{b.date.slice(5)}</td>
                    <td className="mono">{b.start}–{b.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {bookings.length > 0 && !confirmClear && (
            <button className="clear-link" onClick={() => setConfirmClear(true)}>ล้างข้อมูลการจองทั้งหมด</button>
          )}
          {confirmClear && (
            <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--red-text)" }}>
              ยืนยันการล้างข้อมูลการจองทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn primary" style={{ margin: 0 }} onClick={clearAll}>ยืนยันล้างข้อมูล</button>
                <button className="btn ghost" style={{ margin: 0 }} onClick={() => setConfirmClear(false)}>ยกเลิก</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.label} {selected.num}</h3>
            <div className="sub">{fmtDate(bookDate)}</div>

            <div className="grid2">
              <label>
                <span className="field-label">เวลาเริ่ม</span>
                <input className="full" type="time" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
              </label>
              <label>
                <span className="field-label">เวลาสิ้นสุด</span>
                <input className="full" type="time" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
              </label>
            </div>

            <label>
              <span className="field-label">ชื่อผู้จอง *</span>
              <input className="full" type="text" placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </label>

            <label>
              <span className="field-label">รหัสนิสิต (ใช้เป็นรหัสผ่านยกเลิกการจอง) *</span>
              <input className="full" type="text" placeholder="เช่น 65xxxxxxxx" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
              <div className="hint">โปรดจำรหัสนี้ไว้ — ต้องใช้ยืนยันตัวตนหากต้องการยกเลิกการจองภายหลัง</div>
            </label>

            <label>
              <span className="field-label">หมายเหตุ (ถ้ามี)</span>
              <input className="full" type="text" placeholder="เช่น ประชุมกลุ่ม, นัดติว" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
            </label>

            {formError && <div className="err">{formError}</div>}

            <button className="btn primary" disabled={busy} onClick={submitBooking}>
              {busy ? "กำลังบันทึก..." : "ยืนยันการจอง"}
            </button>
            <button className="btn ghost" onClick={closeModal}>ปิด</button>

            {nextBookingFor(selected.id).length > 0 && (
              <div className="existing-list">
                <div className="h">รายการจองของที่นั่งนี้ ในวันที่ {fmtDate(bookDate)}</div>
                {nextBookingFor(selected.id).map((b) => (
                  <div className="exist-row" key={b.id}>
                    <div className="exist-row-top">
                      <span>{b.start}–{b.end} · {b.name}{b.note ? ` (${b.note})` : ""}</span>
                      {cancelingId !== b.id && <button onClick={() => startCancel(b.id)}>ยกเลิก</button>}
                    </div>
                    {cancelingId === b.id && (
                      <div className="cancel-inline">
                        <input
                          type="text"
                          placeholder="ใส่รหัสนิสิตที่ใช้ตอนจอง"
                          value={cancelCode}
                          onChange={(e) => setCancelCode(e.target.value)}
                        />
                        <button className="go" onClick={() => confirmCancel(b)}>ยืนยันยกเลิก</button>
                        <button className="no" onClick={() => { setCancelingId(null); setCancelError(""); }}>ไม่ยกเลิก</button>
                      </div>
                    )}
                    {cancelingId === b.id && cancelError && <div className="err" style={{ marginTop: 6 }}>{cancelError}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
