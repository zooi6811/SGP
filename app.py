import streamlit as st
import pandas as pd
import logic
import database
from datetime import datetime

# ==========================================
# CONFIG & SETUP
# ==========================================
st.set_page_config(
    page_title="SGP Production System",
    page_icon="🏭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# FORCE RELOAD DATA on every interaction to ensure collaboration sync
database.load_data()

# Custom CSS to make it look professional
st.markdown("""
<style>
    .big-font { font-size:24px !important; font-weight: bold; }
    .metric-card { background-color: #f0f2f6; padding: 15px; border-radius: 10px; }
    div.stButton > button { width: 100%; }
</style>
""", unsafe_allow_html=True)

# ==========================================
# SIDEBAR NAVIGATION
# ==========================================
st.sidebar.title("🏭 SGP Production")
st.sidebar.markdown("---")
page = st.sidebar.radio("Go to", [
    "🚀 Dashboard",
    "📅 Job Entry",
    "⏱️ Smart Schedule",
    "📊 Order Progress",
    "✅ Daily Logs",
    "⚙️ Machine Status",
    "📦 Inventory"
])

# ==========================================
# 1. EXECUTIVE DASHBOARD
# ==========================================
if page == "🚀 Dashboard":
    st.title("🚀 Executive Dashboard")
    
    # --- KPIs ---
    stats = logic.get_dashboard_stats()
    sched = logic.generate_smart_schedule()
    target = logic.get_todays_target(sched)
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Yesterday", f"{int(stats['yesterday'])} kg", delta_color="normal")
    col2.metric("This Week", f"{int(stats['week']):,} kg")
    col3.metric("This Month", f"{int(stats['month']):,} kg")
    col4.metric("Today's Target", f"{int(target):,} kg")
    
    st.markdown("---")
    
    # --- SPLIT VIEW ---
    c1, c2 = st.columns([1, 1])
    
    with c1:
        st.subheader("📅 Today's Schedule")
        # Filter schedule for 'Today' (Simple string match for demo)
        today_day = datetime.now().strftime("%a")
        today_jobs = [s for s in sched if today_day in s['start'] and s['machine'] != "UNASSIGNED"]
        
        if today_jobs:
            df_today = pd.DataFrame(today_jobs)
            st.dataframe(
                df_today[['machine', 'start', 'client', 'hours']],
                use_container_width=True,
                hide_index=True
            )
        else:
            st.info("No jobs scheduled for today.")

    with c2:
        st.subheader("🔜 Upcoming Queue")
        # Filter for future/queue jobs
        queue_jobs = [s for s in sched if s['status'] != "Completed"]
        if queue_jobs:
            df_queue = pd.DataFrame(queue_jobs)
            
            # Color coding function for Pandas Styler
            def color_status(val):
                color = '#d4edda' if 'On Time' in val else '#f8d7da' if 'LATE' in val else ''
                return f'background-color: {color}'

            st.dataframe(
                df_queue[['start', 'job', 'client', 'status']].style.map(color_status, subset=['status']),
                use_container_width=True,
                hide_index=True
            )
        else:
            st.success("Queue is empty!")

# ==========================================
# 2. JOB ENTRY
# ==========================================
elif page == "📅 Job Entry":
    st.title("📅 Job Order Entry")
    
    with st.form("new_job_form"):
        c1, c2 = st.columns(2)
        job_id = c1.text_input("Job ID (e.g., JOB-2026-01)")
        client = c2.text_input("Client Name")
        
        c3, c4 = st.columns(2)
        weight = c3.number_input("Target Weight (kg)", min_value=1.0, step=10.0)
        due_date = c4.date_input("Due Date")
        
        c5, c6 = st.columns(2)
        # Convert Recipe Dict to List for Dropdown
        rcp_list = list(database.RECIPES.keys())
        recipe = c5.selectbox("Recipe", rcp_list)
        product = c6.text_input("Product Name")
        
        c7, c8 = st.columns(2)
        width = c7.number_input("Width (mm)", min_value=100.0)
        thick = c8.number_input("Thickness (mm)", min_value=0.01, format="%.3f")

        submitted = st.form_submit_button("➕ Add Job Order")
        
        if submitted:
            try:
                logic.add_new_job(
                    job_id, client, product, weight, recipe, 
                    due_date.strftime("%Y-%m-%d"), width, thick
                )
                st.success(f"Job {job_id} created successfully!")
                st.rerun()
            except ValueError as e:
                st.error(f"Error: {e}")

    # Job List deletion
    st.subheader("Active Jobs")
    active_jobs = [j for j in database.JOBS if j.status != "Completed"]
    if active_jobs:
        df_jobs = pd.DataFrame([j.to_dict() for j in active_jobs])
        st.dataframe(df_jobs[['job_id', 'client', 'product', 'due_date', 'weight']], use_container_width=True)
        
        with st.expander("🗑️ Delete a Job"):
            to_delete = st.selectbox("Select Job to Delete", [j.job_id for j in active_jobs])
            if st.button("Delete Selected Job"):
                logic.delete_job_by_id(to_delete)
                st.rerun()

# ==========================================
# 3. SMART SCHEDULE
# ==========================================
elif page == "⏱️ Smart Schedule":
    st.title("⏱️ Smart Production Schedule")
    
    if st.button("🔄 Run Optimization Algorithm"):
        st.toast("Algorithm Running...", icon="🤖")
    
    schedule = logic.generate_smart_schedule()
    df_sched = pd.DataFrame(schedule)
    
    # Advanced Dataframe with Highlights
    if not df_sched.empty:
        # Create a display-friendly version
        st.dataframe(
            df_sched,
            column_order=("machine", "start", "end", "job", "client", "status", "note"),
            hide_index=True,
            use_container_width=True,
            height=600
        )
    else:
        st.info("No pending jobs to schedule.")

# ==========================================
# 4. ORDER PROGRESS
# ==========================================
elif page == "📊 Order Progress":
    st.title("📊 Order Progress Tracker")
    
    # Filter Controls
    show_completed = st.checkbox("Show Completed Orders")
    
    # Logic to get jobs
    jobs_to_show = database.JOBS
    if not show_completed:
        jobs_to_show = [j for j in jobs_to_show if j.status != "Completed"]

    for job in jobs_to_show:
        data = logic.get_job_progress(job.job_id)
        stages = data['stages']
        
        # Card Container
        with st.container():
            # Header
            col_h1, col_h2, col_h3 = st.columns([2, 1, 1])
            col_h1.markdown(f"**{job.job_id}** - {job.client} ({job.product})")
            
            status_color = "green" if job.status == "Completed" else "blue"
            col_h3.markdown(f":{status_color}[**{job.status}**]")
            
            # Progress Bars
            cols = st.columns(4)
            stage_names = ["Extrusion", "Printing", "Cutting", "Packaging"]
            
            for i, s_name in enumerate(stage_names):
                info = stages.get(s_name, {'percent': 0, 'current': 0})
                with cols[i]:
                    st.caption(f"{s_name}")
                    st.progress(info['percent'] / 100)
                    st.caption(f"{int(info['current'])} / {int(job.weight)} kg")
            
            st.divider()

# ==========================================
# 5. DAILY LOGS
# ==========================================
elif page == "✅ Daily Logs":
    st.title("✅ Production Logging")
    
    c1, c2 = st.columns([1, 2])
    
    with c1:
        st.subheader("New Entry")
        with st.form("log_form"):
            # Job Selector
            active_ids = [j.job_id for j in database.JOBS if j.status != "Completed"]
            job_sel = st.selectbox("Select Job", active_ids)
            
            stage_sel = st.selectbox("Production Stage", ["Extrusion", "Printing", "Cutting", "Packaging"])
            
            log_date = st.date_input("Date")
            output = st.number_input("Good Output (kg)", min_value=0.0)
            waste = st.number_input("Wastage (kg)", min_value=0.0)
            
            if st.form_submit_button("💾 Save Log"):
                try:
                    logic.submit_daily_log(job_sel, str(log_date), output, waste, stage_sel)
                    st.success("Log Saved!")
                    st.rerun()
                except Exception as e:
                    st.error(str(e))

    with c2:
        st.subheader("History")
        if database.LOGS:
            df_logs = pd.DataFrame([l.to_dict() for l in database.LOGS])
            # Show newest first
            df_logs = df_logs.iloc[::-1] 
            st.dataframe(
                df_logs[['date', 'job_id', 'stage', 'output_kg', 'wastage_kg']], 
                use_container_width=True,
                hide_index=True
            )

# ==========================================
# 6. MACHINE STATUS
# ==========================================
elif page == "⚙️ Machine Status":
    st.title("⚙️ Machine Status Control")
    
    # Refresh button
    if st.button("Refresh Status"):
        st.rerun()

    # Grid Layout
    cols = st.columns(3)
    
    for i, mach in enumerate(database.MACHINES):
        col = cols[i % 3]
        with col:
            # Color card based on status
            border = True
            if mach.status == "Running": emoji = "🟢"
            elif mach.status == "Idle": emoji = "⚪"
            else: emoji = "🔴"
            
            with st.expander(f"{emoji} {mach.machine_id} ({mach.machine_type})", expanded=True):
                st.caption(f"Max: {mach.max_width_mm}mm | Mat: {mach.allowed_materials}")
                
                # We need unique keys for widgets inside loops
                new_status = st.selectbox(
                    "Status", 
                    ["Running", "Idle", "Maintenance", "Breakdown"],
                    index=["Running", "Idle", "Maintenance", "Breakdown"].index(mach.status),
                    key=f"stat_{mach.machine_id}"
                )
                
                new_note = st.text_input("Notes", value=mach.notes, key=f"note_{mach.machine_id}")
                
                if st.button("Update", key=f"btn_{mach.machine_id}"):
                    logic.update_machine_status(mach.machine_id, new_status, new_note)
                    st.toast(f"{mach.machine_id} Updated!")
                    st.rerun()

# ==========================================
# 7. INVENTORY
# ==========================================
elif page == "📦 Inventory":
    st.title("📦 Material Inventory")
    
    report = logic.calculate_material_requirements()
    
    # Convert report dict to dataframe
    data = []
    for mat, info in report.items():
        info['material'] = mat
        data.append(info)
    
    if data:
        df_inv = pd.DataFrame(data)
        
        # Color Highlights
        def stock_color(val):
            if val == "CRITICAL": return 'background-color: #f8d7da; color: red'
            if val == "LOW": return 'background-color: #fff3cd; color: orange'
            return ''

        st.dataframe(
            df_inv[['material', 'stock', 'needed', 'available', 'status']].style.map(stock_color, subset=['status']),
            use_container_width=True,
            hide_index=True
        )
        
        st.markdown("### 📥 Quick Restock")
        with st.form("restock"):
            c1, c2 = st.columns(2)
            r_mat = c1.selectbox("Material", df_inv['material'].tolist())
            r_qty = c2.number_input("Add Quantity (kg)", min_value=1.0)
            if st.form_submit_button("Update Stock"):
                logic.restock_material(r_mat, r_qty)
                st.success(f"Added {r_qty}kg to {r_mat}")
                st.rerun()