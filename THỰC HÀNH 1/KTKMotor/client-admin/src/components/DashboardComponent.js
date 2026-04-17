import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { Bar, Line } from 'react-chartjs-2';
import '../styles/general.css';
import '../styles/dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

class Dashboard extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.dashboardRef = React.createRef();
    this.state = {
      revenue: { month: [], quarter: [], year: [] },
      newestProducts: [],
      topProducts: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.apiGetDashboard();
  }

  apiGetDashboard() {
    const config = { headers: { 'x-access-token': this.context.token } };

    Promise.all([
      axios.get('/api/admin/dashboard/revenue', config),
      axios.get('/api/admin/dashboard/products/newest?limit=5', config),
      axios.get('/api/admin/dashboard/products/top?limit=5', config)
    ])
      .then(([revenueRes, newestRes, topRes]) => {
        this.setState({
          revenue: revenueRes.data,
          newestProducts: newestRes.data,
          topProducts: topRes.data,
          loading: false,
          error: null
        });
      })
      .catch((err) => {
        console.error('Dashboard API error:', err);
        this.setState({ loading: false, error: 'Không thể lấy dữ liệu dashboard' });
      });
  }

  async exportToPdf() {
    if (!this.dashboardRef.current) return;
    const element = this.dashboardRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 20;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    let position = 10;

    // Thêm tiêu đề báo cáo
    pdf.setFontSize(20);
    pdf.text('KTK Motor - Báo cáo Dashboard', 10, 20);
    pdf.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('vi-VN');
    pdf.text(`Ngày xuất: ${currentDate}`, 10, 30);
    position = 40; // Điều chỉnh vị trí bắt đầu nội dung

    if (imgHeight < pageHeight - position) {
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    } else {
      const ratio = (pageWidth - 20) / imgProps.width;
      const totalPages = Math.ceil((imgProps.height * ratio) / (pageHeight - position));
      for (let page = 0; page < totalPages; page += 1) {
        const sourceY = page * (pageHeight - position) / ratio;
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height - sourceY, (pageHeight - position) / ratio);
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, -sourceY, canvas.width, canvas.height);
        const pageImgData = pageCanvas.toDataURL('image/png');
        if (page > 0) pdf.addPage();
        pdf.addImage(pageImgData, 'PNG', 10, page === 0 ? position : 10, imgWidth, Math.min(imgHeight, pageHeight - (page === 0 ? position : 10)));
      }
    }

    pdf.save('dashboard-report.pdf');
  }

  buildChartData(revenue, label, color) {
    return {
      labels: revenue.map(item => item.period),
      datasets: [
        {
          label,
          data: revenue.map(item => item.total),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          tension: 0.3,
          fill: false
        }
      ]
    };
  }

  render() {
    const { revenue, newestProducts, topProducts, loading, error } = this.state;
    const monthData = this.buildChartData(revenue.month, 'Doanh thu theo tháng', 'rgba(54, 162, 235, 0.7)');
    const quarterData = this.buildChartData(revenue.quarter, 'Doanh thu theo quý', 'rgba(75, 192, 192, 0.7)');
    const yearData = this.buildChartData(revenue.year, 'Doanh thu theo năm', 'rgba(255, 159, 64, 0.7)');

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Báo cáo doanh thu' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString()
          }
        }
      }
    };

    return (
      <div ref={this.dashboardRef}>
        <h2 className="text-center">ADMIN DASHBOARD</h2>

        <div className="dashboard-export-container">
          <button onClick={() => this.exportToPdf()} className="dashboard-export-button">
            Xuất PDF
          </button>
        </div>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        {!loading && !error && (
          <>
            <section>
              <h3>Doanh thu</h3>
              <div className="dashboard-charts-grid">
                <div className="dashboard-card">
                  <h4>Theo tháng</h4>
                  <Line data={monthData} options={chartOptions} />
                </div>
                <div className="dashboard-card">
                  <h4>Theo quý</h4>
                  <Bar data={quarterData} options={chartOptions} />
                </div>
                <div className="dashboard-card">
                  <h4>Theo năm</h4>
                  <Bar data={yearData} options={chartOptions} />
                </div>
              </div>
            </section>

            <section className="dashboard-summary-grid">
              <div className="dashboard-card">
                <h3>Sản phẩm mới nhất</h3>
                <ul>
                  {newestProducts.map(product => (
                    <li key={product._id}>{product.name} - {Number(product.price).toLocaleString()} VND</li>
                  ))}
                </ul>
              </div>

              <div className="dashboard-card">
                <h3>Sản phẩm mua nhiều nhất</h3>
                <ul>
                  {topProducts.map(product => (
                    <li key={product._id}>{product.name} - {Number(product.price).toLocaleString()} VND</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    );
  }
}

export default Dashboard;
