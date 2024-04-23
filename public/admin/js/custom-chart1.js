document.addEventListener('DOMContentLoaded', function () {
    const productCategoryData = <%= productCategoryDistribution %>

    const categories = productCategoryData.map(item => item._id?.name || 'Unknown');
    const counts = productCateogryData.map(item => item.count);

    const chartData = {
        labels: categories,
        datasets: [{
          label: 'Category Wise Sales',
          data: counts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    
      const ctx = document.getElementById('categorywiseSalesChart').getContext('2d');
    
      const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
});

