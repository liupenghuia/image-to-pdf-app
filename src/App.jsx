import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Upload, FileImage, Download, X, ArrowUp, ArrowDown } from 'lucide-react'
import jsPDF from 'jspdf'
import './App.css'

function App() {
  const [selectedImages, setSelectedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef(null)

  // 处理图片选择
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result,
          name: file.name
        }
        setSelectedImages(prev => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
    
    // 清空input值，允许重复选择同一文件
    event.target.value = ''
  }

  // 删除图片
  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id))
  }

  // 移动图片位置
  const moveImage = (id, direction) => {
    setSelectedImages(prev => {
      const index = prev.findIndex(img => img.id === id)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newImages = [...prev]
      const temp = newImages[index]
      newImages[index] = newImages[newIndex]
      newImages[newIndex] = temp
      
      return newImages
    })
  }

  // 生成PDF
  const generatePDF = async () => {
    if (selectedImages.length === 0) {
      alert('请先选择图片')
      return
    }

    setIsGenerating(true)
    
    try {
      const pdf = new jsPDF()
      
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        
        // 创建一个临时的Image对象来获取图片尺寸
        const img = new Image()
        img.src = image.url
        
        await new Promise((resolve) => {
          img.onload = () => {
            const imgWidth = img.width
            const imgHeight = img.height
            
            // PDF页面尺寸 (A4: 210 x 297 mm)
            const pdfWidth = 210
            const pdfHeight = 297
            
            // 计算图片在PDF中的尺寸，保持宽高比
            let finalWidth = pdfWidth - 20 // 左右各留10mm边距
            let finalHeight = (imgHeight * finalWidth) / imgWidth
            
            // 如果高度超过页面，则按高度缩放
            if (finalHeight > pdfHeight - 20) { // 上下各留10mm边距
              finalHeight = pdfHeight - 20
              finalWidth = (imgWidth * finalHeight) / imgHeight
            }
            
            // 居中显示
            const x = (pdfWidth - finalWidth) / 2
            const y = (pdfHeight - finalHeight) / 2
            
            // 如果不是第一页，添加新页面
            if (i > 0) {
              pdf.addPage()
            }
            
            // 添加图片到PDF
            pdf.addImage(image.url, 'JPEG', x, y, finalWidth, finalHeight)
            resolve()
          }
        })
      }
      
      // 下载PDF
      pdf.save('images-to-pdf.pdf')
      
    } catch (error) {
      console.error('生成PDF时出错:', error)
      alert('生成PDF时出错，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          多图片转PDF工具——PP
        </h1>
        
        {/* 上传区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              选择图片
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileImage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">点击选择图片文件</p>
              <p className="text-sm text-gray-500">支持 JPG, PNG, GIF 等格式</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* 图片预览区域 */}
        {selectedImages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>已选择的图片 ({selectedImages.length})</span>
                <Button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isGenerating ? '生成中...' : '生成PDF'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {selectedImages.map((image, index) => (
                  <div key={image.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{image.name}</p>
                      <p className="text-sm text-gray-500">第 {index + 1} 页</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === selectedImages.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• 点击上方区域选择一张或多张图片</li>
              <li>• 可以通过上下箭头调整图片在PDF中的顺序</li>
              <li>• 点击"生成PDF"按钮将所有图片合并为一个PDF文件</li>
              <li>• 每张图片将占用PDF的一页，自动调整大小以适应页面</li>
              <li>• 生成的PDF文件将自动下载到您的设备</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

